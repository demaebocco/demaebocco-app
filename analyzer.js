'use strict';

var _ = require('underscore');
var WordSplitter = require('./wordSplitter.js');

var splitter = new WordSplitter('dj0zaiZpPUNna3RLOUE5Rk1HTSZzPWNvbnN1bWVyc2VjcmV0Jng9OWQ-');

function parse(words) {
  console.log(words);

  var places = ['外', '出前', '手前'];

  // 外でラーメンが食べたい -> {delivery: false, food: 'ラーメン'}
  // カレー -> {delivery: false, food: 'カレー'}
  // 出前で寿司を -> {delivery: true, food: '寿司'}
  // 寿司を出前でお願い -> {delivery: true, food: '寿司}

  for (var i = 0; i < places.length; i++) {
    var place = places[i];

    var index = words.indexOf(place);
    if (index >= 0) {
      var p = words[index];
      var temp = words.slice();
      temp.splice(index, 1);

      return {
        delivery: p !== '外',
        food: _.first(temp)
      };
    }
  }

  var food = _.first(words);
  if (food) {
    return {
      delivery: false,
      food: food
    };
  }

  return false;
}

var analyze = function (text, callback) {
  splitter.split(text, function (words) {
    words = _.isArray(words) ? words : [words];

    // 名詞だけ抽出
    var nouns = words
          .filter(function (word) {
            return word.pos === '名詞';
          })
          .map(function (word) {
            return word.surface;
          });

    var type = parse(nouns);

    callback(type);
  });
};

module.exports = {
  analyze: function (text) {
    return new Promise(function (resolve) {
      analyze(text, resolve);
    });
  }
};
