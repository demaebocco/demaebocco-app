'use strict';

var fs = require('fs');
var twilio = require('twilio');
var express = require('express');
var bodyParser = require('body-perser');
var _ = require('underscore');
var config = require('./configReader.js').read().twilio;

var app = express();
app.use(bodyParser());

app
  .post('/twilio/order', function (request, response) {
    console.log(request.body);

    var template = _.template(fs.readFileSync('twilio/templates/order.xml', 'utf8'));
    var twiml = template({message: 'こちらは自動出前システム出前ボッコです。'});
    response.send(twiml);
  });

app.listen(3000, function () {
  call();
});

function call() {
  var client = twilio(config.accountSid, config.authToken);

  client
    .accounts(config.accountSid)
    .calls.create({
      to: config.to,
      from: config.from,
      ulr: config.url
    }, function (error, call) {
      console.log(error);
      console.log(call);
    });
}
