'use strict';

var EventEmitter = require('events');
var util = require('util');
var bocco = require('DemaeBocco');

function Bocco(options) {
  this.options = options || {};
  var that = this;

  bocco.getMessageMediaAudio(function (data) {
    setTimeout(function () {
      bocco.wave2text(data.audio,
                      'AIzaSyAFltwcHvvnDCYDwo6fezLntFeHFrSXL70',
                      function (text) {
                        that.emit('response', text);
                      });
    }, 3000);
  });
}

util.inherits(Bocco, EventEmitter);

Bocco.prototype.send = function (text) {
  bocco.postMessageText(text, function () {});
};

module.exports = Bocco;
