'use strict';

// This is the script that runs on the raspberry pi.

var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var cmd = require('node-cmd');

var connectionString = 'HostName=pigallery.azure-devices.net;DeviceId=raspigallery;SharedAccessKey=hgbZT3WUaCOtwnAiHToTxzYCYoNU03PZ09s2hw+MyPw=';

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var isRunning = false;

var connectCallback = function (err) {
  if (err) {
    console.error('***Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      if (isRunning) {
        console.log('Command already running');
      } else {
        isRunning = true;
        cmd.get('sudo ../rpi-rgb-led-matrix/utils/led-image-viewer -t5 ../gallery/' + msg.data + '.gif', function() {
          isRunning = false;
        });
      }
      // When using MQTT the following line is a no-op.
      client.complete(msg, printResultFor('completed'));
    });

    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      client.removeAllListeners();
      client.open(connectCallback);
    });
  }
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}
