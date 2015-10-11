'use strict';

var config = require('./configReader.js').read();

var factory = {
  'foodChooser': function () {
    var FoodChooser = require('./foodchooser.js');
    return new FoodChooser();
  },
  'niseFoodChooser': function (options) {
    var NiseFoodChooser = require('./niseFoodChooser.js');
    return new NiseFoodChooser(options.name);
  }
};

function create(optType, optOptions) {
  var type = optType || config.foodChooser.type;
  var options = optOptions || config.foodChooser.options;

  return factory[type](options);
}

module.exports = {
  create: create
};
