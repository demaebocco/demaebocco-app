'use strict';

var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var twilio = require('twilio');

/**
 * Create Twilio Server
 * @class
 */
function TwilioServer(options) {
  this.options_ = _.defaults(options || {}, {
    server: '',
    port: 3000,
    path: '/'
  });
  this.callbacks_ = {};
  this.defers_ = {};
}

/**
 * Start Twilio Server
 */
TwilioServer.prototype.start = function () {
  var app = express();
  app.use(bodyParser());

  app.post(this.options_.path, (function (request, response) {
    var sid = request.body.CallSid;

    var defer = this.defers_[sid];
    if (defer) {
      defer.resolve(request.body);

      setImmediate((function () {
        var make = this.defers_[sid].makeTwiml;
        if (make) {
          response.send(make(request.body));
        } else {
          response.end();
        }
      }).bind(this));
    }

  }).bind(this));

  return new Promise((function (resolve, reject) {
    app.listen(this.options_.port, function () {
      resolve();
    });
  }).bind(this));
};

TwilioServer.prototype.promise = function (sid, name, makeTwiml) {
  var defer = this.defers_[sid] = {};
  
  return new Promise(function (resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
    defer.makeTwiml = makeTwiml;
  });
};

TwilioServer.prototype.dial = function (tel) {
  return this.dial_(tel)
    .then((function (result) {
      var sid = result.CallSid || result.sid;

      return this.promise(sid, 'dial');
    }).bind(this));
};

TwilioServer.prototype.dial_ = function (tel) {
  var options = this.options_;
  
  return new Promise(function (resolve, reject) {
    var client = twilio(options.accountSid, options.authToken);

    client
      .accounts(options.accountSid)
      .calls.create({
        to: tel,
        from: options.from,
        url: options.url
      }, function (error, call) {
        if (error) {
          reject(error);
        }

        resolve(call);
      });
  });
};


TwilioServer.prototype.twiml = function () {
  var server = this;
  
  return {
    make: function (name, factory) {
      return function (result) {
        var sid = result.CallSid || result.sid;

        return server.promise(sid, name, factory);
      };
    },
    loop: function (message) {
      return (function (result) {
        return this.gather(message)(result)
          .then((function (result) {
            if (result.Digits === '0') {
              return this.loop(message)(result);
            }
            return result;
          }).bind(this));
      }).bind(this);
    },
    say: function (message) {
      return this.make('say', function () {
        var template = _.template(fs.readFileSync('twilio/templates/say.xml', 'utf8'));
        return template({message: message});
      });
    },
    gather: function (message) {
      return this.make('gather', function () {
        var template = _.template(fs.readFileSync('twilio/templates/gather.xml', 'utf8'));
        return template({message: message});
      });
    },
    hangup: function () {
      return this.make('hangup', function () {
        var template = _.template(fs.readFileSync('twilio/templates/hangup.xml', 'utf8'));
        return template();
      });
    }
  };
};

module.exports = TwilioServer;
