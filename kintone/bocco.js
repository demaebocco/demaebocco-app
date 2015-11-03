'use strict';

var Kintone = require('./kintone.js');

var kintone = new Kintone();
var bocco = kintone.getApp('bocco');

function getRecords () {
  return bocco.getRecords(['name', 'type', 'options'])
    .then(function (records) {
      return records.map(function (record) {
        console.log(record);
        record.options = JSON.parse(record.options);
        return record;
      });
    });
}

module.exports = getRecords;
