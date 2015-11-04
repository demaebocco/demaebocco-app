'use strict';

var _ = require('underscore');
var GNaviRestaurantChooser = require('./gNaviRestaurantChooser.js');
var KintoneRestaurantChooser = require('./kintoneRestaurantChooser.js');

function SmartRestaurantChooser() {
  this.choosers_ = {
    gNavi: new GNaviRestaurantChooser(),
    kintone: new KintoneRestaurantChooser()
  };
}

SmartRestaurantChooser.prototype.choose = function (condition) {
  var chooser = condition.delivery ?
        this.choosers_.kintone : this.choosers_.gNavi;
  return chooser.choose(condition);
};

SmartRestaurantChooser.prototype.getDescription = function () {
  return '状況に合わせて、' +
    (_.chain(this.choosers_)
     .values()
     .map(function (chooser) { return chooser.getDescription(); })) +
    ' のどちらかを使用します。';
};

module.exports = SmartRestaurantChooser;
