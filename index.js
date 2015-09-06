'use strict';

var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var bocco = require('DemaeBocco');
var kintone = require('node_kintone');
var jaCodeMap = require('jaCodeMap');
var calling = require('./calling.js');

var boccoMock = (function () {
  return {
    postMessageText: function (text, callback) {
      console.log('mock.say: ' + text);
      callback && setImmediate(function () {
        callback({});
      });
    },
    getMessageMediaAudio: function (callback) {
      callback && setImmediate(function () {
        callback({});
      });
    }
  };
})();

var makeFlow = function (bocco) {
  var events = {};

  var flow = new EventEmitter();
  flow.say = function (text, isCallback) {
    console.log('SAY: ' + text); // eslint-disable-line no-console
    bocco.postMessageText(text, function () {});

    if (isCallback) {
      var that = this;
      bocco.getMessageMediaAudio(function (json) {
        setTimeout(function () {
          bocco.wav2text(json.audio,
                         'AIzaSyAFltwcHvvnDCYDwo6fezLntFeHFrSXL70',
                         function (text) {
                           that.emit('response', text);
                         });
        }, 3000);
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
};

var getFoods = function (callback) {
  var subdomain = "tf-web";
  var loginName = "t_furu@tf-web.jp";
  var passwd 　　= "y8sgFJir";
  var api_token = "koGrXyWGLS9PMKT65sg3eScSfDHGYxYt3TPP5UAd";
  kintone.setAccount(subdomain,loginName,passwd,api_token);

  kintone.getRecords(14, null, null, null, function (json) {
    var data = json.records.map(function (line) {
      return line['文字列__1行_'].value;
    });
    callback && callback(data);
  });
};

var chooseFood = function (callback) {
  getFoods(function (data) {
    var index = Math.floor(Math.random() * data.length);
    var food = data[index];
    callback && callback(food);
  });
};

var run = function (flow) {
  chooseFood(function (food) {
    flow.say('お昼どうする？おすすめの' + food + 'があるよ？', true);
    flow.once('response', function (text) {
      console.log(text);
      if (text.indexOf('はい') >= 0) {

        flow.order('注文お願いします。とんかつ一人前、さくらハウスまで');
        flow.once('ordered', function (minutes) {
          if (minutes) {
            flow.say(jaCodeMap.h2f(minutes + '分後に届くよ！'));
            setTimeout(function () {
              flow.say('もうすぐ届くよ！');
            }, minutes * 60 * 1000);
          } else {
            flow.say('たまには外に出ろ！');
          }
        });
      } else {
        flow.say('そうかあー');
      }
    });
  });
};

var app = express();
app.use(bodyParser());

var flow;

app
  .get('/start', function (request, response) {
    flow = makeFlow(bocco);
    run(flow);
    response.end();
  })
  .get('/mock', function (request, response) {
    flow = makeFlow(boccoMock);
    run(flow);
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
          flow.responseMinutes(0);
          break;
        case '9':
          flow.responseMinutes(1);
          break;
      }
    }

    var tml = fs.readFileSync('order.xml', 'utf8');
    response.send(tml);
  });

app.listen(3000, '0.0.0.0');
console.log('Server runningat http://localhost:3000');
