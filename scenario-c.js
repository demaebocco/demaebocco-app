'use strict';

var jaCodeMap = require('jaCodeMap');
var analyzer = require('./analyzer.js');

function decorateFlow(flow) {
  return {
    say: function (text, isCallback) {
      arguments[0] = jaCodeMap.h2f(arguments[0]);
      flow.say.apply(flow, Array.prototype.slice.apply(arguments));

      if (isCallback) {
        return new Promise(function (resolve, reject) {
          flow.once('response', function (text) {
            resolve(text);
          });
        });
      } else {
        return Promise.resolve();
      }
    },
    chooseRestaurant: function () {
      return flow.chooseRestaurant.apply(flow, Array.prototype.slice.apply(arguments));
    },
    order: function () {
      flow.order.apply(flow, Array.prototype.slice.apply(arguments));

      return new Promise(function (resolve, reject) {
        flow.once('ordered', function (minutes) {
          resolve(minutes);
        });
      });
    },
    timeout: function (miliseconds) {
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, miliseconds);
      });
    },
    analyze: function () {
      return analyzer.analyze.apply(analyzer, Array.prototype.slice.apply(arguments));
    }
  };
}

function wrap(flow, optProise) {
  var promise = optProise || Promise.resolve();
  var then = promise.then;

  function wrapMethod (method) {
    return function () {
      var args = Array.prototype.slice.apply(arguments);

      return wrap(flow, promise.then(function () {
        return method.apply(flow, args);
      }));
    };
  }

  promise.say = wrapMethod(flow.say);
  promise.chooseRestaurant = wrapMethod(flow.chooseRestaurant);
  promise.order = wrapMethod(flow.order);
  promise.timeout = wrapMethod(flow.timeout);
  promise.analyze = wrapMethod(flow.analyze);

  promise.then = function () {
    return wrap(flow, then.apply(promise, Array.prototype.slice.apply(arguments)));
  };

  return promise;
}

function run(flow) {
  flow = decorateFlow(flow);
  flow = wrap(flow);

  flow
    .say('お昼どうする?', true)
    .then(function (text) {
      return flow.analyze(text);
    })
    .then(function (type) {
      return flow.chooseRestaurant({
        food: type.food,
        delivery: type.delivery
      })
        .then(function (data) {
          console.log(data);
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
      console.log(info);

      if (!info) {
        return flow.say('たまには外に出ろ!');
      }

      if (!info.delivery) {
        return flow.say('今日は' + info.restaurant.nameKana + 'がオススメだよ。いってらっしゃい');
      }

      var foodName = info.food.kanaName || info.food.name;
      return flow
        .say('今日は' + foodName + 'がオススメだよ。注文する?', true)
        .then(function (text) {
          return text.indexOf('はい') >= 0 || text.indexOf('食べる') >= 0 || text.indexOf('食べたい') >= 0;
        })
        .then(function (isOrder) {
          if (!isOrder) {
            return flow.say('そうかあ');
          }

          return flow
            .order('ご注文をお願いします。' + info.food.name + '一人前。さくらハウスで。30分なら1を、45分なら2を、60分なら3を、無理なら4を押してください。')
            .then(function (minutes) {
              if (!minutes) {
                return flow.say('たまには外に出ろ');
              }

              return flow
                .say(minutes + '分後に届くよ!')
                .timeout(minutes * 60 * 1000)
                .say('もうすぐ届くよ!');
            });
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = {
  run: run
};
