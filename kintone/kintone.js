'use strict';

var _ = require('underscore');
var config = require('../configReader.js').read().kintone;
var kintoneCreate = require('node_kintone').create;

function Kintone(options) {
  this.options_ = options || config;
}

Kintone.prototype.getApp = function (appName, optApiToken) {
  var app = config.apps[appName].app;
  var apiToken = optApiToken || config.apps[appName].api_token;

  var options = _.extend({}, this.options_, {
    app: app,
    api_token: apiToken
  });

  return new KintoneApp(options);
};

function KintoneApp(options) {
  this.kintone_ = kintoneCreate(options);
  this.app_ = options.app;
}

KintoneApp.prototype.getRecrodsDirect = function (fields) {
  return new Promise((function (resolve, reject) {
    this.kintone_.getRecords(this.app_, fields, null, null, function (result) {
      resolve(result);
    });
  }).bind(this));
};

KintoneApp.prototype.getRecords = function (fields) {
  return this.getRecrodsDirect(fields)
    .then(function (result) {
      return result.records
        .map(function (record) {
          return _.chain(record)
            .pairs()
            .map(function (pair) {
              return [pair[0], pair[1].value];
            })
            .object()
            .value();
        });
    });
};

module.exports = Kintone;
