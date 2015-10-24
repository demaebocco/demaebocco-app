'use strict';

var chooseRestaurant = function (callback) {
  callback({
    restaurant: {
      name: '銀のさら宇宿店',
      nameKana: 'ギンノサラウスキテン'
    },
    food: {
      name: '寿司'
    }
  });
};

function NiseRestaurantChooser() {
}

NiseRestaurantChooser.prototype.choose = function () {
  return new Promise(function (resolve) {
    chooseRestaurant(resolve);
  });
};

NiseRestaurantChooser.prototype.getDescription = function () {
  return '何を選んでも銀のさら宇宿店を返すニセのお店選び';
};

module.exports = NiseRestaurantChooser;
