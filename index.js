'use strict';

var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var bocco = require('DemaeBocco');
var jaCodeMap = require('jaCodeMap');
var calling = require('./calling.js');

var flow = (function () {
  var events = {};

  var flow = new EventEmitter();
  flow.say = function (text, isCallback) {
    bocco.postMessageText(text, function () {});
    console.log('SAY: ' + text); // eslint-disable-line no-console

    if (isCallback) {
      var that = this;
      bocco.getMessageMediaAudio(function (json) {
        that.emit('response', 'yes');
      });
    }
  };
  flow.order = function (text) {
    var that = this;

    console.log('ORDER: ' + text); // eslint-disable-line no-console
    calling();
  };
  flow.responseMinutes = function (minutes) {
    this.emit('ordered', minutes);
  };

  return flow;
})();

var run = function () {
  flow.say('お昼どうする？おすすめのとんかつがあるよ？', true);
  flow.once('response', function (text) {
    if (text === 'yes') {

      flow.order('注文お願いします。とんかつ一人前、さくらハウスまで');
      flow.once('ordered', function (minutes) {
        flow.say(jaCodeMap.h2f(minutes + '分後に届くよ！'));
        setTimeout(function () {
          flow.say('もうすぐ届くよ！');
        }, minutes * 60 * 1000);
      });
    }
  });
};

var app = express();
app.use(bodyParser());

app
  .get('/start', function (request, response) {
    run();
    response.end();
  })
  .post('/twilio/order', function (request, response) {
    console.log('POST /twilio/order');
    
    var data = request.body; 
    if (data.Digits) {
      console.log(data.Digits);
      switch (data.Digits) {
        case '1':
          flow.responseMinutes(30);
          break;
        case '2':
          flow.responseMinutes(45);
          break;
        case '3':
          flow.responseMinutes(60);
          break;
        case '4':
          flow.responseIgnore(60);
          break;
        case '9':
          flow.responseMinutes(1);
          break;
      }
      flow.responseMinutes(1);
    }

    var tml = fs.readFileSync('order.xml', 'utf8');
    response.send(tml);
  });

app.listen(3000, '0.0.0.0');
console.log('Server runningat http://localhost:3000');
