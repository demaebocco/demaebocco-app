'use strict';

var request = require('request');
var xml2json = require('xml2json');
var jaCodeMap = require('jaCodeMap');
var WordSplitter = require('./wordSplitter.js');

var splitter = new WordSplitter('dj0zaiZpPUNna3RLOUE5Rk1HTSZzPWNvbnN1bWVyc2VjcmV0Jng9OWQ-');

var getType = function (words) {
  var index = words.indexOf('外');
  if (index >= 0) {
    return {
      index: index,
      type: '外'
    };
  }
  index = words.indexOf('出前');
  if (index > 0) {
    return {
      index: index,
      type: '出前'
    };
  }

  return false;
};

var analyze = function (text, callback) {
  splitter.split(text, function (words) {
    // 名詞だけ抽出
    var nouns = words
          .filter(function (word) {
            return word.pos === '名詞';
          })
          .map(function (word) {
            return word.surface;
          });

    // '外' とか '出前' を探す
    var type = getType(words);
    var food;
    if (type) {
      // '外' とか '出前' とかの次の名詞を食べ物と判断する
      type.food = words[type.index + 1];
    }

    callback(type);
  });
};

var run = function (flow) {
  flow.say('お昼どうする？', true);
  flow.once('response', function (text) {
    analyze(text, function (type) {
      if (type.type === '外') {
        flow.say('おすすめの' + type.food + 'があるよ？いってらっしゃい。');
      } else if (type.type === '出前') {
        flow.say('おすすめの' + type.food + 'があるよ？', true);
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
