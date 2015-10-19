'use strict';

var run = function (flow) {
  flow.say('お昼どうする？', true);
  flow.once('response', function (text) {
    if (text.indexOf('出前で') >= 0) {
      flow.say('今日は銀のさらがオススメだよ。');
    } else if (text.indexOf('外で') >= 0) {
      flow.say('今日はジョイフルがオススメだよ。行ってらっしゃい。');
    }
  });
};

module.exports = {
  run: run
};
