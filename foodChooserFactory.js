'use strict';

var fs = require('fs');
var path = require('path');
var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

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
