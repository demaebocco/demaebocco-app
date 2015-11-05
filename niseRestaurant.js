'use strict';

var EventEmitter = require('events');
var util = require('util');
var MilkCocoa = require('milkcocoa');
var Nise = require('./nise.js');

var sender = 'DemaeBocco';

function NiseRestaurant (name) {
  this.name = name;

  var nise = this.nise = new Nise(name);
  var that = this;

  nise.on('response', function (text) {
    that.emit('response', text);
  });
}

util.inherits(NiseRestaurant, EventEmitter);

NiseRestaurant.prototype.registerTwilio = function () {
  return Promise.resolve();
};

NiseRestaurant.prototype.order = function (text) {
  this.nise.send(text);
};

NiseRestaurant.prototype.getDescription = function () {
  var urlEncode = encodeURIComponent(this.name);
  return 'ニセ店舗 (<a href="http://demaebocco.github.io/nise/#/device/' + urlEncode + '" target="_blank">' + this.name + '</a>に店舗へのメッセージが出力されます)';
};

module.exports = NiseRestaurant;
