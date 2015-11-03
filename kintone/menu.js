'use strict';

var Kintone = require('./kintone.js');

var kintone = new Kintone();
var menu = kintone.getApp('menu');

function getRecords() {
  return menu.getRecords(['shop', 'food', 'price', 'ctg', 'type', 'options'])
    .then(function (records) {
      return records
        .map(function (record) {
          record.options = JSON.parse(record.options);
          return record;
        });
    });
}

module.exports = getRecords;
