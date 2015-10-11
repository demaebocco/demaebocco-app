'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var userConfig = readConfig('config.json');
var defaultConfig = readConfig('config.default.json');
var config = _.extend({}, defaultConfig, userConfig);

function readConfig (fileName) {
  var pathText = path.join(__dirname, fileName);
  if (fs.existsSync(pathText)) {
    return JSON.parse(fs.readFileSync(pathText, 'utf8'));
  } else {
    return undefined;
  }
}

module.exports = {
  read: function () {
    return config;
  }
};
