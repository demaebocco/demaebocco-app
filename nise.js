'use strict';

var EventEmitter = require('events');
var util = require('util');
var MilkCocoa = require('milkcocoa');
var milkcocoa = new MilkCocoa('hotif8ab67j.mlkcca.com');

var sender = 'DemaeBocco';

function Nise (name) {
  var dataStore = this.dataStore = milkcocoa.dataStore('nise/' + name);
  var that = this;

  dataStore.on('send', function (data) {
    if (data.value.sender !== sender) {
      that.emit('response', data.value.text);
    }
  });
}

util.inherits(Nise, EventEmitter);

Nise.prototype.send = function (text) {
  this.dataStore.send({text: text, sender: sender});
};

module.exports = Nise;
