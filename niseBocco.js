'use strict';

var EventEmitter = require('events');
var util = require('util');
var MilkCocoa = require('milkcocoa');

var sender = 'DemaeBocco';

function NiseBocco (name) {
  var milkcocoa = new MilkCocoa('hotif8ab67j.mlkcca.com');
  var dataStore = this.dataStore = milkcocoa.dataStore('nise/' + name);

  var that = this;

  dataStore.on('send', function (data) {
    if (data.value.sender !== sender) {
      that.emit('response', data.value.text);
    }
  });
}

util.inherits(NiseBocco, EventEmitter);

NiseBocco.prototype.send = function (text) {
  this.dataStore.send({text: text, sender: sender});
};

module.exports = NiseBocco;
