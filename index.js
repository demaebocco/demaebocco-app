'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var bocco = require('./boccoFactory.js').create();
var RestaurantFactory = require('./restaurantFactory.js');
var foodChooser = require('./foodChooserFactory.js').create();
var restaurantChooser = require('./restaurantChooserFactory.js').create();
var TwilioServer = require('./twilio/twilioServer.js');
var twilioServer = new TwilioServer();

var orderMessage;

var makeFlow = function (bocco, foodChooser, restaurantChooser) {
  var events = {};

  var flow = new EventEmitter();
  flow.bocco = bocco;
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
  flow.order = function (text, type, options) {
    var that = this;

    if (type) {
      var restaurant = RestaurantFactory.create(type, options);
      restaurant.registerTwilio(twilioServer);
    }

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

  flow.chooseRestaurant = function (condition) {
    return restaurantChooser.choose(condition);
  };

  return flow;
};

function runFlow(scenario) {
  bocco.getBoccos().forEach(function (bocco) {
    var flow = makeFlow(bocco, foodChooser, restaurantChooser);
    scenario.run(flow);
  });
}

function start() {
  var app = express();
  app.use(bodyParser());

  app
    .get('/', function (request, response) {
      require('./showHtml.js').run(request, response, {
        bocco: bocco,
        foodChooser: foodChooser,
        restaurantChooser: restaurantChooser
      });
    })
    .get('/start-c', function (request, response) {
      runFlow(require('./scenario-c.js'));
      response.end();
    });

  app.listen(3000, '0.0.0.0');
  console.log('Server runningat http://localhost:3000');
};

Promise.all([bocco.ready(), twilioServer.start()])
  .then(function () {
    start();
  });
