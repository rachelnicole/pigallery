'use strict';

const IotClient = require('azure-iothub').Client;
const IotMessage = require('azure-iot-common').Message;
const config = require('./config.js');

const iotClient = IotClient.fromConnectionString(config.IOT_CONN_STRING);

// Temp, rewrite logic once socket connection is set up.
const msg = "kirby"

  iotClient.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Client connected');
      // const data = JSON.stringify(msg);
      const message = new IotMessage(msg);
      console.log('Sending message: ' + message.getData());
      iotClient.send(config.IOT_DEVICE_ID, message, printResultFor('send'));
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
