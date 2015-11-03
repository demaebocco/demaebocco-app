'use strict';

var Kintone = require('./kintone.js');

var kintone = new Kintone();
var bocco = kintone.getApp('bocco');

function getRecords () {
  return bocco.getRecords(['enabled', 'name', 'type', 'options'])
    .then(function (records) {
      return records
        .filter(function (record) {
          return record.enabled.indexOf('enabled') >= 0;
        })
        .map(function (record) {
          console.log(record);
          record.options = JSON.parse(record.options);
          return record;
        });
    });
}

module.exports = getRecords;
