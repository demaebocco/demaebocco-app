'use strict';

var jaCodeMap = require('jaCodeMap');
var analyzer = require('./analyzer.js');

function slow(tel) {
  return tel.split('').join(' ') + ' ';
}

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
    },
    bocco: flow.bocco
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
  promise.bocco = flow.bocco;

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
      if (!type) {
        return type;
      }

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

          var type = info.restaurant.type;
          var options = info.restaurant.options;
          var name = flow.bocco.config.name;
          var address = flow.bocco.config.address;
          var place = address + 'の' + name;
          var tel = flow.bocco.config.tel;

          var slowTel = slow(tel);
          var message = 'こちらは自動出前注文システム出前ボッコです。最初に電話番号を、つづけてお届け先と注文内容をお伝えいたします。0 を押すと、最初から再生いたします。電話番号、' + slowTel + '。繰り返します。電話番号、' + slowTel + '。お届け先は' + place + '鹿児島県鹿児島市さくらハウス。繰り返します。お届け先は' + place + '。メニューは、' + info.food.name + 'を一つ。以上です。お届け予定時間が30分なら1を、45分なら2を、60分なら3を、無理なら4を、最初からもう一度聞くには0を押してください。';

          return flow
            .order(message, type, options)
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
