require('dotenv').config();
var IotClient = require('azure-iothub').Client;
var IotMessage = require('azure-iot-common').Message;
var iotClient = IotClient.fromConnectionString(process.env.IOT_CONN_STRING);
var fs = require('fs');
var express = require('express');
var app = module.exports.app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var port = process.env.PORT || 3000;
var azure = require('azure-storage');
var blobService = azure.createBlobService(process.env.AZURE_STORAGE_CONNECTION_STRING);
var tmp = require('tmp');
var path = require('path');

var baseUrlPath = 'https://tinygallery.blob.core.windows.net/pixelart/';


server.listen(port);


// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {

  blobService.listBlobsSegmented('pixelart', null, function (err, result) {
    console.log(err);
    console.log(result);
    var images = [];
    result.entries.forEach((blob) => {
      var fullPath = baseUrlPath + blob.name;
      console.log(fullPath);
      images.push(fullPath);
    })
    res.render('pages/index', {
      images: images
    });
  });

});

iotClient.open(function (err) {
  if (err) {
    console.error('*** Could not connect: ' + err.message);
  } else {
    console.log('IOT client connected');
    io.on('connection', function (socket) {
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


app.post('/upload', upload.single('galleryIcon'), function (req, res) {

  var savedFile = req.file.path + ".gif";
  fs.renameSync(req.file.path, savedFile);


  console.log('File saved to "' + savedFile + '"');

  blobService.createContainerIfNotExists('pixelart', {
    publicAccessLevel: 'blob'
  }, function (error, result, response) {
    console.log(error);
    if (!error) {
      blobService.createBlockBlobFromLocalFile('pixelart', path.basename(savedFile), savedFile, function (error, result, response) {
        if (!error) {
          // file uploaded
          console.log('file uploaded');
          fs.unlink('./' + savedFile, (err) => {
            if (err) {
              console.log("failed to delete local image:" + err);
            } else {
              console.log('successfully deleted local image');
            }
          });
        }
      });
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