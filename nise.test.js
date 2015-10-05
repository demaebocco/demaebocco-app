'use strict';

var NiseBocco = require('./niseBocco.js');
var niseBocco = new NiseBocco('#Boccoさくらハウス');

niseBocco.send('hogehoge');
niseBocco.once('response', function (text) {
  console.log(text);
});
