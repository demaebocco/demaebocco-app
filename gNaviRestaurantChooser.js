'use strict';

var config = require('./configReader.js').read().gNavi;
var GNavi = require('node_gnavi');

var select = function (restaurants) {
  if (restaurants.length > 0) {
    return restaurants[Math.floor(Math.random() * restaurants.length)];
  }
  return false;
};

var convert = function (rest) {
  return {
    name: rest.name,
    nameKana: rest['name_kana'],
    tel: rest.tel
  };
};

var search = function (condition) {
  var that = this;

  return new Promise(function (resolve, reject) {
    that.gnavi_.search({
      address: '鹿児島市',
      freeword: condition.food,
      lunch: 1
    }, function (error, response, json) {
      if (error || json.error) {
        reject(error || json.error);
      } else {
        resolve(json);
      }
    });
  });
};

var chooseRestaurant = function (condition) {
  return search.call(this, condition)
    .then(function (data) {
      // 0 件 -> 空の配列に
      // 1 件 -> 一件の配列に (結果が配列では帰ってこないので...)
      // 2 件以上 -> 配列に
      var count = Number(data['total_hit_count']);
      if (count === 1) {
        return [data.rest];
      } else if (count > 1) {
        return data.rest;
      }
      return data.rest;
    })
    .then(function (data) {
      return data.map(convert);
    })
    .then(select)
    .then(function (data) {
      if (data) {
        return {
          restaurant: data,
          food: {
            name: condition.food
          }
        };
      }
      return false;
    });
};

function GNaviRestaurantChooser(optAccessKey) {
  var accessKey = optAccessKey || config.accessKey;
  this.gnavi_ = new GNavi(accessKey);
}

GNaviRestaurantChooser.prototype.choose = function (condition) {
  return chooseRestaurant.call(this, condition);
};

GNaviRestaurantChooser.prototype.getDescription = function () {
  return 'ぐるなびレストランAPIを使ってお昼ごはんのお店を選びます';
};

module.exports = GNaviRestaurantChooser;
