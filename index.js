'use strict';

var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var Bocco = require('./bocco.js');
var bocco = new Bocco();
var NiseBocco = require('./niseBocco.js');
var niseBocco = new NiseBocco('#Boccoさくらハウス');
var kintone = require('node_kintone');
var jaCodeMap = require('jaCodeMap');
var calling = require('./calling.js');

var orderMessage;

var makeFlow = function (bocco) {
  var events = {};

  var flow = new EventEmitter();
  flow.say = function (text, isCallback) {
    console.log('SAY: ' + text); // eslint-disable-line no-console
    bocco.send(text);

    if (isCallback) {
      var that = this;
      bocco.once('response', function (text) {
        that.emit('response', text);
      });
    }
  };
  flow.order = function (text) {
    var that = this;

    console.log('ORDER: ' + text); // eslint-disable-line no-console
    orderMessage = text;
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

        flow.order('ご注文をお願いします。' + food + '一人前。さくらハウスで。30分なら1を、45分なら2を、60分なら3を、無理なら4を押してください。');
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
    flow = makeFlow(niseBocco);
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

    var template = _.template(fs.readFileSync('order.xml', 'utf8'));
    var tml = template({message: orderMessage});
    response.send(tml);
  });

app.listen(3000, '0.0.0.0');
console.log('Server runningat http://localhost:3000');
