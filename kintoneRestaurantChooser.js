'use strict';

function KintoneRestaurantChooser() {
}

var select = function (restaurants) {
  if (restaurants.length > 0) {
    return restaurants[Math.floor(Math.random() * restaurants.length)];
  }
  return false;
};

function convert(record) {
  return {
    restaurant: {
      name: record.shop,
      type: record.type,
      options: record.options
    },
    food: {
      name: record.food
    }
  };
}

KintoneRestaurantChooser.prototype.choose = function (condition) {
  return require('./kintone/menu.js')()
    .then(function (records) {
      var filtered = records
            .filter(function (record) {
              return record.ctg === condition.food;
            })
            .map(convert);

      return select(filtered);
    });
};

KintoneRestaurantChooser.prototype.getDescription = function () {
  return 'Kintone からメニューを取得するお店選び';
};

module.exports = KintoneRestaurantChooser;
