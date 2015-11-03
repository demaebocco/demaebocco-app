'use strict';

var EventEmitter = require('events');
var util = require('util');
var TwilioServer = require('./twilio/twilioServer.js');

function Restaurant(options) {
  this.options_ = options;
}

util.inherits(Restaurant, EventEmitter);

Restaurant.prototype.registerTwilio = function () {
  var server = new TwilioServer(this.options_);
  server.start();

  this.server_ = server;
};

Restaurant.prototype.order = function (text) {
  var server = this.server_;
  var twiml = server.twiml();
  var that = this;

  console.log(this.options_);

  server
    .dial(this.options_.to)
    .then(twiml.loop(text))
    .then(function (result) {
      console.log(result.Digits);
      that.emit('response', result.Digits);
      return result;
    })
    .then(twiml.hangup());
};

Restaurant.prototype.getDescription = function () {
  var urlEncode = encodeURIComponent(this.name);
  return '設定ファイルに記述された店舗に電話をかけます。';
};

module.exports = Restaurant;
