'use strict';

var fs = require('fs');
var twilio = require('twilio');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var config = require('./configReader.js').read().twilio;


var app = express();
app.use(bodyParser());

var defers = {};

app
    .post('/twilio/order', function (request, response) {
        var sid = request.body.CallSid;
        var defer = defers[sid];

        console.log(sid);

        if (defer) {
            console.log('resolve: ' + defer.name);
            defer.resolve(request.body);

            setImmediate(function () {
                var twiml = defers[sid].twiml;
                if (twiml) {
                    response.send(twiml(request.body));
                }
            });
        }
    });

app.listen(3000, function () {
    order('並寿司一人前',
          '鹿児島市荒田１丁目16-7 イイテラス403、さくらハウス',
          config.to);
});

function order(launch, address, tel) {
    var slowTel = tel.split('').join('、');

    var first = '' +
            'こちらは自動出前システム、出前ボッコです。' +
            '出前をお願いします。' +
            launch + 'を、' + address + '、までお願いします。' +
            '電話番号は、' + slowTel + '、です。' +
            'もう一度聞くには、0、を、' +
            'お届けできる時間が、30分後なら、1、を、' +
            '45分後なら、2、を、' +
            '60分後なら、3、を、' +
            'お届けできないなら、9、を押してください。';

    start(tel)
        .then(loop(first))
        .then(function (result) {
            return say('ありがとうございました。')(result);
        })
        .then(hangup());
}

function loop(message) {
    return function (result) {
        return gather(message)(result)
            .then(function (result) {
                if (result.Digits === '0') {
                    return loop(message)(result);
                }
                return result;
            });
    };
}

function say(message) {
    return twiml('say', function () {
        var template = _.template(fs.readFileSync('twilio/templates/say.xml', 'utf8'));
        return template({message: message});
    });
}

function gather(message) {
    return twiml('gather', function () {
        var template = _.template(fs.readFileSync('twilio/templates/gather.xml', 'utf8'));
        return template({message: message});
    });
}

function hangup() {
    return twiml('hangup', function () {
        var template = _.template(fs.readFileSync('twilio/templates/hangup.xml', 'utf8'));
        return template();
    });
}

function twiml(name, factory) {
    return function (result) {
        var sid = result.CallSid || result.sid;
        var defer = defers[sid] = {};

        return new Promise(function (resolve, reject) {
            defer.name = name;
            defer.twiml = factory;
            defer.resolve = resolve;
        });
    };
}

function start(tel) {
    return call(tel)
        .then(function (result) {
            var sid = result.CallSid || result.sid;
            var defer = defers[sid] = {};

            return new Promise(function (resolve, result) {
                defer.resolve = resolve;
            });
        });
}

function call(tel) {
    return new Promise(function (resolve, reject) {
        var client = twilio(config.accountSid, config.authToken);

        client
            .accounts(config.accountSid)
            .calls.create({
                to: tel,
                from: config.from,
                url: config.url
            }, function (error, call) {
                if (error) {
                    reject(error);
                }

                resolve(call);
            });
    });
}
