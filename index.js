'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var bocco = require('./boccoFactory.js').create();
var restaurant = require('./restaurantFactory.js').create();
var foodChooser = require('./foodChooserFactory.js').create();
var calling = require('./calling.js');
var scenario = require('./scenario.js');

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

var app = express();
app.use(bodyParser());

var flow;

app
  .get('/', function (request, response) {
    require('./showHtml.js').run(request, response, {
      bocco: bocco,
      restaurant: restaurant,
      foodChooser: foodChooser
    });
  })
  .get('/start', function (request, response) {
    flow = makeFlow(bocco, restaurant, foodChooser);
    scenario.run(flow);
    response.end();
  });
restaurant.registerTwilio(app);

app.listen(3000, '0.0.0.0');
console.log('Server runningat http://localhost:3000');
