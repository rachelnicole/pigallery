require('dotenv').config();
var IotClient = require('azure-iothub').Client;
var IotMessage = require('azure-iot-common').Message;
var iotClient = IotClient.fromConnectionString(process.env.IOT_CONN_STRING);
var fs = require('fs');
var express = require('express');
var app = module.exports.app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var port = process.env.PORT || 3000;
var azure = require('azure-storage');
var fileService = azure.createFileService();
var Readable = require('stream').Readable;
var uuidv4 = require('uuid/v4');

server.listen(port);

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  // grab xml from azure file storage and convert to json to construct gallery view.
  res.sendFile(__dirname + '/index.html');
});

iotClient.open(function (err) {
  if (err) {
    console.error('*** Could not connect: ' + err.message);
  } else {
    console.log('IOT client connected');
    io.on('connection', function(socket) {
      console.log('socket.io client connected');
      // const data = JSON.stringify(msg);
      socket.on('artPiece', function (artPiece) {
        console.log('received artPiece "' + artPiece + '"');
        var message = new IotMessage(artPiece);
        console.log('Sending message: ' + message.getData());
        iotClient.send(process.env.IOT_DEVICE_ID, message, printResultFor('send'));
      });
    });
  }
});

app.post('/upload', upload.single('galleryIcon'), function(req, res) {
  var rs = new Readable;
  rs.push(req.file.buffer);
  rs.push(null);
  console.log(req.file);

  fileService.createShareIfNotExists('pixelart', function(error, result, response) {
    var randomName = uuidv4();
    if (!error) {
      console.log('made new file share');
      fileService.createFileFromStream('pixelart','', randomName + '.gif', rs, req.file.buffer.length, function(error, ...result){
        if (error) {
          console.log(error);
        }
        console.log(result);
      }) 
    }
  });

  res.send('youre doing great');
});

  function printResultFor(op) {
    return function printResult(err, res) {
      if (err) {
        console.log(op + ' error: ' + err.toString());
      } else {
        console.log(op + ' status: ' + res.constructor.name);
      }
    };
  }

  function handleError(error) {
    console.log(error);
  }