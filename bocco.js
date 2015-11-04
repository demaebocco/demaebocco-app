'use strict';

var EventEmitter = require('events');
var util = require('util');
var boccoCreate = require('DemaeBocco').create;

function Bocco(roomId, accessToken) {
  var that = this;

  if (roomId && accessToken) {
    this.roomId = roomId;

    this.bocco_ = boccoCreate(roomId, accessToken);
  }

  this.bocco_.getMessageMediaAudio(function (data) {
    setTimeout(function () {
      that.bocco_.wav2text(data.audio,
                     'AIzaSyAFltwcHvvnDCYDwo6fezLntFeHFrSXL70',
                     function (text) {
                       that.emit('response', text);
                     });
    }, 3000);
  });
}

util.inherits(Bocco, EventEmitter);

Bocco.prototype.send = function (text) {
  this.bocco_.postMessageText(text, function () {});
};

Bocco.prototype.getDescription = function () {
  return 'Bocco (RoomId: ' + this.roomId + ')';
};

module.exports = Bocco;
