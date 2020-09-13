'use strict';

// This is the script that runs on the raspberry pi.

const Protocol = require('azure-iot-device-mqtt').Mqtt,
      Client = require('azure-iot-device').Client,
      Message = require('azure-iot-device').Message,
      config = require('./config'),
      cmd = require('node-cmd'),
      connectionString = config.IOTHUB,
      // fromConnectionString must specify a transport constructor, coming from any transport package.
      client = Client.fromConnectionString(connectionString, Protocol);

let isRunning = false;

let connectCallback = function (err) {
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
