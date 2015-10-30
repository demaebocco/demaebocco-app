'use strict';

var EventEmitter = require('events');
var util = require('util');
var calling = require('./calling.js');
var fs = require('fs');

function registerTwilio(Restaurant, app, callback) {
  app.post('/twilio/order', function (request, response) {
    console.log('POST /twilio/order');

    var data = request.body;
    if (data.Digits) {
      console.log(data.Digits);

      callback(data.Digits);
    }

    var template = _.template(fs.readFileSync('order.xml', 'utf8'));
    var tml = template({message: Restaurant.orderMessage});
    response.send(tml);
  });
}

function Restaurant(name, app) {
  this.name = name;
}

util.inherits(Restaurant, EventEmitter);

Restaurant.prototype.registerTwilio = function (app) {
  var that = this;

  registerTwilio(this, app, function (text) {
    that.emit('response', text);
  });
};

Restaurant.prototype.order = function (text) {
  this.orderMessage = text;
  calling();
};

module.exports = Restaurant;
