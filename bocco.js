'use strict';

var EventEmitter = require('events');
var util = require('util');
var bocco = require('DemaeBocco');

function Bocco(roomId, accessToken) {
  var that = this;

  if (roomId && accessToken) {
    this.roomId = roomId;

    bocco
      .setRoomId(roomId)
      .setAccessToken(accessToken);
  }

  bocco.getMessageMediaAudio(function (data) {
    setTimeout(function () {
      bocco.wav2text(data.audio,
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

Bocco.prototype.getDescription = function () {
  return 'Bocco (RoomId: ' + this.roomId + ')';
};

module.exports = Bocco;
