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
      console.log(condition);
  return require('./kintone/menu.js')()
    .then(function (records) {
      var filtered = records;
      console.log('----------');
      console.log(condition);
      console.log(filtered);

      // kintone menu アプリから食べ物・店舗を取得
      // 食べ物が指定されていた時はそれだけを抽出
      // 食べ物が指定なしの時はすべてが対象
      if (condition.food) {
        filtered = filtered
          .filter(function (record) {
            return record.ctg === condition.food;
          });
      }
      filtered = filtered.map(convert);
      return select(filtered);
    });
};

KintoneRestaurantChooser.prototype.getDescription = function () {
  return 'Kintone からメニューを取得するお店選び';
};

module.exports = KintoneRestaurantChooser;
