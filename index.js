'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var bocco = require('./boccoFactory.js').create();
var restaurant = require('./restaurantFactory.js').create();
var foodChooser = require('./foodChooserFactory.js').create();
var jaCodeMap = require('jaCodeMap');
var calling = require('./calling.js');

var orderMessage;

var makeFlow = function (bocco, restaurant, foodChooser) {
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

    restaurant.order(text);
    restaurant.once('response', function (text) {
      switch (text) {
      case '1':
        that.responseMinutes(30);
        break;
      case '2':
        that.responseMinutes(45);
        break;
      case '3':
        that.responseMinutes(60);
        break;
      case '4':
        that.responseMinutes(0);
        break;
      case '9':
        that.responseMinutes(1);
        break;
      }
    });
  };
  flow.responseMinutes = function (minutes) {
    this.emit('ordered', minutes);
  };

  flow.chooseFood = function () {
    return foodChooser.choose();
  };

  return flow;
};

var run = function (flow) {
  flow.chooseFood()
    .then(function (food) {
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
  .get('/', function (request, response) {
    require('./showHtml.js').run(request, response);
  })
  .get('/start', function (request, response) {
    flow = makeFlow(bocco, restaurant, foodChooser);
    run(flow);
    response.end();
  });
restaurant.registerTwilio(app);

app.listen(3000, '0.0.0.0');
console.log('Server runningat http://localhost:3000');
