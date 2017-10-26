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
var blobService = azure.createBlobService();
var Readable = require('stream').Readable;
var uuidv4 = require('uuid/v4');
var tmp = require('tmp');

var urlPath = 'https://tinygallery.file.core.windows.net/pixelart?sv=2017-04-17&si=pixelart-15F36AD1CD6&sr=s&sig=0IQFFAxSEUu88gOH4f%2BKE5PJaxK%2FnH2g%2FRlP719SdAI%3D';


server.listen(port);


// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {

  require('azure-storage')
  .createFileService(process.env.AZURE_STORAGE_CONNECTION_STRING)
  .listFilesAndDirectoriesSegmented('pixelart', '', null, null, (err, result) => {

    res.render('pages/index', {
      urlPath: urlPath,
      drinks: result.entries.files
    });
  
  });
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
  var filePath = req.file;
  var randomName = uuidv4();
  var fd = './';

  tmp.file(function _tempFileCreated(err, filePath, fd, cleanupCallback) {
    if (err) throw err;
    
    console.log('File: ', filePath);
    console.log('Filedescriptor: ', fd);
    
    // If we don't need the file anymore we could manually call the cleanupCallback 
    // But that is not necessary if we didn't pass the keep option because the library 
    // will clean after itself. 
    cleanupCallback();
  });

 // fs.writeFile(randomName + '.gif', req.file);
  // req.file is the image people are using

  // blobService.createContainerIfNotExists('pixelart', {
  //   publicAccessLevel: 'blob'
  // }, function(error, result, response) {
  //   var randomName = uuidv4();
  //   if (!error) {
  //     blobService.createBlockBlobFromLocalFile('tinygallery', 'pixelart', req.file, function(error, result, response) {
  //       if (!error) {
  //         // file uploaded
  //       }
  //     });
  //   }
  // });

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