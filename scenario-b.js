'use strict';

var request = require('request');
var xml2json = require('xml2json');
var jaCodeMap = require('jaCodeMap');

var url = 'http://jlp.yahooapis.jp/MAService/V1/parse?appid=dj0zaiZpPUNna3RLOUE5Rk1HTSZzPWNvbnN1bWVyc2VjcmV0Jng9OWQ-';

function splitWords(text, callback) {
    request
      .post({
        url: url,
        form: {
          sentence: text
        }
      }, function (error, response, body) {
        var result = JSON.parse(xml2json.toJson(body));
        console.log(result);
        callback(result.ResultSet['ma_result']['word_list'].word);
      });

}

var run = function (flow) {
  flow.say('お昼どうする？', true);
  flow.once('response', function (text) {
    splitWords(text, function (words) {
      var texts = words
            .filter(function (word) { return word.pos === '名詞'; })
            .map(function (word) { return word.surface; });
      if (texts.indexOf('外') >= 0) {
        var index = texts.indexOf('外');
        var food = texts[index + 1];
        flow.say('おすすめの' + food + 'があるよ？いってらっしゃい。');
      } else if (texts.indexOf('出前') >= 0) {
        var index = texts.indexOf('出前');
        var food = texts[index + 1];
        flow.say('おすすめの' + food + 'があるよ？', true);
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
      }
    });
  });
};

module.exports = {
  run: run
};
