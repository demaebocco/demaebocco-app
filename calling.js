'use strict';

module.exports = function () {
  var twilio = require('twilio');
  var client = twilio('account_sid', 'auth_token');

  client.accounts('account_sid').calls
    .create({
      to: 'to',
      from: 'from',
      url: 'url'
    }, function (error, call) {
      console.log(error);
      console.log(call);
    });
};
