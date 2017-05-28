var IotClient = require('azure-iothub').Client;
var IotMessage = require('azure-iot-common').Message;
var iotClient = IotClient.fromConnectionString(process.env.IOT_CONN_STRING);
var fs = require('fs');
var express = require('express');
var app = module.exports.app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

server.listen(port);

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) { 

  iotClient.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Client connected');
      // const data = JSON.stringify(msg);
      socket.on('artNumber', function (artNumber) {
        console.log('received artNumber');
        var message = new IotMessage(artNumber);
        console.log('Sending message: ' + message.getData());
        iotClient.send(process.env.IOT_DEVICE_ID, message, printResultFor('send'));
      });
    }
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
});