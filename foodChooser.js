'use strict';

var getFoods = function (callback) {
  var subdomain = "tf-web";
  var loginName = "t_furu@tf-web.jp";
  var passwd 　　= "y8sgFJir";
  var api_token = "koGrXyWGLS9PMKT65sg3eScSfDHGYxYt3TPP5UAd";
  kintone.setAccount(subdomain,loginName,passwd,api_token);

  kintone.getRecords(14, null, null, null, function (json) {
    var data = json.records.map(function (line) {
      return line['文字列__1行_'].value;
    });
    callback && callback(data);
  });
};

var chooseFood = function (callback) {
  getFoods(function (data) {
    var index = Math.floor(Math.random() * data.length);
    var food = data[index];
    callback && callback(food);
  });
};

function FoodChooser() {
}

FoodChooser.prototype.choose = function () {
  return new Promise(function (resolve) {
    chooseFood(resolve);
  });
};

module.exports = FoodChooser;
