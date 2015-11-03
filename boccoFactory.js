'use strict';

var config = require('./configReader.js').read();

var factory = {
  'bocco': function (options) {
    var Bocco = require('./bocco.js');
    return new Bocco(options.roomId, options.accessToken);
  },
  'niseBocco': function (options) {
    var NiseBocco = require('./niseBocco.js');
    return new NiseBocco(options.name);
  },
  'multiBocco': function () {
    var MultiBocco = require('./multiBocco.js');
    return new MultiBocco();
  }
};

function create(optType, optOptions) {
  var type = optType || config.bocco.type;
  var options = optOptions || config.bocco.options;

  var bocco = factory[type](options);

  if (!bocco.ready) {
    bocco.ready = function () {
      return Promise.resolve(bocco);
    };
  }
  if (!bocco.getBoccos) {
    bocco.getBoccos = function () {
      return [bocco];
    };
  }

  return bocco;
}

module.exports = {
  create: create
};
