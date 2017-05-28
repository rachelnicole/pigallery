'use strict';

// This is the script that runs on the raspberry pi.

var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var cmd = require('node-cmd');

var connectionString = 'HostName=pigallery.azure-devices.net;DeviceId=raspigallery;SharedAccessKey=hgbZT3WUaCOtwnAiHToTxzYCYoNU03PZ09s2hw+MyPw=';

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      if (msg.data == "1") {
        console.log("its a match");
        cmd.run('sudo ../rpi-rgb-led-matrix/utils/led-image-viewer -t5 ../rpi-rgb-led-matrix/kirby.gif');
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
