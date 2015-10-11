'use strict';

var config = require('./configReader.js').read();

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
