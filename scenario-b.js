'use strict';

var jaCodeMap = require('jaCodeMap');
var analyzer = require('./analyzer.js');

var run = function (flow) {
  flow.say('お昼どうする？', true);
  flow.once('response', function (text) {
    analyzer.analyze(text)
      .then(function (type) {
        return flow.chooseRestaurant({
          food: type.food,
          delivery: type.delivery
        })
          .then(function (data) {
            // {
            //   restaurant: レストラン情報...,
            //   food: 食べ物情報...,
            //   delivery: true or false...
            // }
            data.delivery = type.delivery;
            return data;
          });
      })
      .then(function (info) {
        if (!info.delivery) {
          flow.say('今日は' + info.restaurant.nameKana + 'がオススメだよ。いってらっしゃい。');
        } else {
          var foodName = info.food.kanaName || info.food.name;
          flow.say('今日は' + foodName + 'がオススメだよ。注文する？', true);
          flow.once('response', function (text) {
            console.log(text);
            if (text.indexOf('はい') >= 0) {

              flow.order('ご注文をお願いします。' + info.food.name + '一人前。さくらハウスで。30分なら1を、45分なら2を、60分なら3を、無理なら4を押してください。');
              flow.once('ordered', function (minutes) {
                if (minutes) {
                  flow.say(jaCodeMap.h2f(minutes + '分後に届くよ！'));
                  setTimeout(function () {
                    flow.say('もうすぐ届くよ！');
                  }, minutes * 60 * 1000);
                } else {
                  flow.say('たまには外に出ろ！');
                }
              });
            } else {
              flow.say('そうかあー');
            }
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};

module.exports = {
  run: run
};
