'use strict';

var config = require('./configReader.js').read();

var factory = {
  'niseRestaurantChooser': function () {
    var NiseRestaurantChooser = require('./niseRestaurantChooser.js');
    return new NiseRestaurantChooser();
  },
  'kintoneRestaurantChooser': function () {
    var KintoneRestaurantChooser = require('./kintoneRestaurantChooser.js');
    return new KintoneRestaurantChooser();
  },
  'gNaviRestaurantChooser': function (options) {
    var GNaviRestaurantChooser = require('./gNaviRestaurantChooser.js');
    return new GNaviRestaurantChooser(options.accessKey);
  }
};

function create(optType, optOptions) {
  var type = optType || config.restaurantChooser.type;
  var options = optOptions || config.restaurantChooser.options;

  return factory[type](options);
}

module.exports = {
  create: create
};
