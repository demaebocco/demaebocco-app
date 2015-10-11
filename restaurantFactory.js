'use strict';

var fs = require('fs');
var path = require('path');
var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

var factory = {
  'restaurant': function () {
    var Restaurant = require('./restaurant.js');
    return new Restaurant();
  },
  'niseRestaurant': function (options) {
    var NiseRestaurant = require('./niseRestaurant.js');
    return new NiseRestaurant(options.name);
  }
};

function create(optType, optOptions) {
  var type = optType || config.restaurant.type;
  var options = optOptions || config.restaurant.options;

  return factory[type](options);
}

module.exports = {
  create: create
};
