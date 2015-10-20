'use strict';

var request = require('request');
var xml2json = require('xml2json');

function WordSplitter(appid) {
  this.url_ = 'http://jlp.yahooapis.jp/MAService/V1/parse?appid=' + appid;
}

WordSplitter.prototype.split = function (text, callback) {
  request
    .post({
      url: this.url_,
      form: {
        sentence: text
      }
    }, function (error, response, body) {
      var result = JSON.parse(xml2json.toJson(body));
      console.log(result);
      callback(result.ResultSet['ma_result']['word_list'].word);
    });
};

module.exports = WordSplitter;
