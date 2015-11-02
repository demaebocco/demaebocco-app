'use strict';

var fs = require('fs');
var _ = require('underscore');
var config = require('./configReader.js').read().twilio;

var TwilioServer = require('./twilio/twilioServer.js');

var server = new TwilioServer(config);
var twiml = server.twiml();

server.start()
  .then(function () {
    order('並寿司一人前',
          '鹿児島市荒田１丁目16-7 イイテラス403、さくらハウス',
          config.to);

    order('とんかつ一人前',
          'ほげほげ、ルームB',
          config.to2);
  });

function order(launch, address, tel) {
  var slowTel = tel.split('').join('、');
  
  var orderMessage = '' +
        'こちらは自動出前システム、出前ボッコです。' +
        '出前をお願いします。' +
        launch + 'を、' + address + '、までお願いします。' +
        '電話番号は、' + slowTel + '、です。' +
        'もう一度聞くには、0、を、' +
        'お届けできる時間が、30分後なら、1、を、' +
        '45分後なら、2、を、' +
        '60分後なら、3、を、' +
        'お届けできないなら、9、を押してください。';
  
  server.dial(tel)
    .then(twiml.loop(orderMessage))
    .then(function (result) {
      return twiml.say('ありがとうございました。')(result);
    })
    .then(twiml.hangup());
}
