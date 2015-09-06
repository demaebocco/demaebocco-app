'use strict';

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.js', 'utf-8')).twilio;

module.exports = function () {
  var twilio = require('twilio');
  var client = twilio(config.accountSid, config.authToken);

  client.accounts(config.accountSid).calls
    .create({
      to: config.to,
      from: config.from,
      url: 'http://spada.masakura.jp:3000/twilio/real-order'
    }, function (error, call) {
      console.log(error);
      console.log(call);
    });
};
