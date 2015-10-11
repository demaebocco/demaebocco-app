'use strict';

var jaCodeMap = require('jaCodeMap');

var run = function (flow) {
  flow.chooseFood()
    .then(function (food) {
      flow.say('お昼どうする？おすすめの' + food + 'があるよ？', true);
      flow.once('response', function (text) {
        console.log(text);
        if (text.indexOf('はい') >= 0) {

          flow.order('ご注文をお願いします。' + food + '一人前。さくらハウスで。30分なら1を、45分なら2を、60分なら3を、無理なら4を押してください。');
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
    });
};

module.exports = {
  run: run
};
