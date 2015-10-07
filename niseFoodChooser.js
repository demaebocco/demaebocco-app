'use strict';

function NiseFoodChooser() {
}

NiseFoodChooser.prototype.choose = function () {
  return new Promise(function (resolve) {
    resolve('とんかつ');
  });
};

module.exports = NiseFoodChooser;
