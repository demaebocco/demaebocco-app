'use strict';

function NiseFoodChooser() {
}

NiseFoodChooser.prototype.choose = function () {
  return new Promise(function (resolve) {
    resolve('とんかつ');
  });
};

NiseFoodChooser.prototype.getDescription = function () {
  return 'ニセお昼ごはん選び ("とんかつ"だけを返します)';
};

module.exports = NiseFoodChooser;
