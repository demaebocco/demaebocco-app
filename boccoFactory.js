'use strict';

var fs = require('fs');
var path = require('path');
var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

var factory = {
  'bocco': function () {
    var Bocco = require('./bocco.js');
    return new Bocco();
  },
  'niseBocco': function (options) {
    var NiseBocco = require('./niseBocco.js');
    return new NiseBocco(options.name);
  }
};

function create(optType, optOptions) {
  var type = optType || config.bocco.type;
  var options = optOptions || config.bocco.options;

  return factory[type](options);
}

module.exports = {
  create: create
};
