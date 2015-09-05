'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var bocco = require('DemaeBocco');

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

    setImmediate(function () {
      that.emit('ordered', 1);
    });
  };

  return flow;
})();

var run = function () {
  flow.say('お昼どうする？おすすめのとんかつがあるよ？', true);
  flow.once('response', function (text) {
    if (text === 'yes') {

      flow.order('注文お願いします。とんかつ一人前、さくらハウスまで');
      flow.once('ordered', function (time) {

        flow.say('１分後に届くよ！');
        setTimeout(function () {
          flow.say('もうすぐ届くよ！');
        }, time * 60 * 1000);
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
  });

app.listen(3000, '0.0.0.0');
console.log('Server runningat http://localhost:3000');
