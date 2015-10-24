var WordSplitter = require('./wordSplitter.js');

var splitter = new WordSplitter('dj0zaiZpPUNna3RLOUE5Rk1HTSZzPWNvbnN1bWVyc2VjcmV0Jng9OWQ-');

var getType = function (words) {
  console.log(words);
  var index = words.indexOf('外');
  if (index >= 0) {
    return {
      index: index,
      type: '外'
    };
  }
  index = words.indexOf('出前');
  if (index >= 0) {
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
    var type = getType(nouns);
    var food;
    if (type) {
      // '外' とか '出前' とかの次の名詞を食べ物と判断する
      type.food = nouns[type.index + 1];
    }

    callback(type);
  });
};

module.exports = {
  analyze: analyze
};
