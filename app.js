// Bringing in my environment file so I can grab my API info.
require('dotenv').config();

const IotClient = require('azure-iothub').Client,
      IotMessage = require('azure-iot-common').Message,
      iotClient = IotClient.fromConnectionString(process.env.IOT_CONN_STRING),
      fs = require('fs'),
      express = require('express'),
      app = module.exports.app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server, { perMessageDeflate:false}),
      multer = require('multer'),
      upload = multer({ dest: 'uploads/' }),
      port = process.env.PORT || 3000,
      azure = require('azure-storage'),
      blobService = azure.createBlobService(process.env.AZURE_STORAGE_CONNECTION_STRING),
      tmp = require('tmp'),
      path = require('path');

// Grabbed this from azure blob storage
let baseUrlPath = 'https://tinygallery.blob.core.windows.net/pixelart/';


server.listen(port);

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  
  // We're connecting to azure file service, pulling down the images that are currently saved, and displaying them.
  blobService.listBlobsSegmented('pixelart', null, function (err, result) {

    console.log(err);
    console.log(result);

    let images = [];
    result.entries.forEach((blob) => {
      let fullPath = baseUrlPath + blob.name;
      console.log(fullPath);
      images.push(fullPath);
    })
    res.render('pages/index', {
      images: images
    });
  });
});

// Opening socket connection, logging messages to the console on success / error.
iotClient.open( err => {
  if (err) {
    console.error('*** Could not connect: ' + err.message);
  } else {
    console.log('IOT client connected');
    io.on('connection', function (socket) {
      console.log('socket.io client connected');

      socket.on('artPiece', function (artPiece) {
        console.log('received artPiece "' + artPiece + '"');

        let message = new IotMessage(artPiece);

        console.log('Sending message: ' + message.getData());
        
        iotClient.send(process.env.IOT_DEVICE_ID, message, printResultFor('send'));
      });
    });
  }
});

// upload for images
app.post('/upload', upload.single('galleryIcon'), function (req, res) {

  let savedFile = req.file.path + ".gif";
  fs.renameSync(req.file.path, savedFile);


  console.log('File saved to "' + savedFile + '"');

  blobService.createContainerIfNotExists('pixelart', {
    publicAccessLevel: 'blob'
  }, (error, result, response) => {
    console.log(error);
    if (!error) {
      blobService.createBlockBlobFromLocalFile('pixelart', path.basename(savedFile), savedFile, (error, result, response) => {
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

let printResultFor = op => {
  return (err, res) => {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    } else {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}

let handleError = error => {
  console.log(error);
}