'use strict';

var EventEmitter = require('events');
var util = require('util');
var MilkCocoa = require('milkcocoa');
var Nise = require('./nise.js');

function NiseBocco (name) {
  this.name = name;

  var nise = this.nise = new Nise(name);
  var that = this;

  nise.on('response', function (text) {
    that.emit('response', text);
  });
}

util.inherits(NiseBocco, EventEmitter);

NiseBocco.prototype.send = function (text) {
  this.nise.send(text);
};

NiseBocco.prototype.getDescription = function () {
  var urlEncode = encodeURIComponent(this.name);
  return 'ニセBocco (<a href="http://demaebocco.github.io/nise/#/device/' + urlEncode + '" target="_blank">' + this.name + '</a>に Bocco へのメッセージが出力されます)';
};

module.exports = NiseBocco;
