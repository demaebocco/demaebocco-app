'use strict';

var EventEmitter = require('events');
var util = require('util');
var MilkCocoa = require('milkcocoa');
var Nise = require('./nise.js');

var sender = 'DemaeBocco';

function NiseRestaurant (name) {
  var nise = this.nise = new Nise(name);
  var that = this;

  nise.on('response', function (text) {
    that.emit('response', text);
  });
}

util.inherits(NiseRestaurant, EventEmitter);

NiseRestaurant.prototype.registerTwilio = function () {
};

NiseRestaurant.prototype.order = function (text) {
  this.nise.send(text);
};

module.exports = NiseRestaurant;
