'use strict';

var boccoFactory = require('./boccoFactory.js');

function MultiBocco() {
}

MultiBocco.prototype.multiple = true;

MultiBocco.prototype.ready = function () {
  return require('./kintone/bocco.js')()
    .then(function (infos) {
      return infos.map(function (info) {
        return boccoFactory.create(info.type, info.options, info);
      });
    })
    .then((function (boccos) {
      this.boccos_ = boccos;
      return boccos;
    }).bind(this));
};

MultiBocco.prototype.getDescription = function () {
  return this.boccos_
    .map(function (bocco) {
      return bocco.getDescription();
    });
};

MultiBocco.prototype.getBoccos = function () {
  return this.boccos_;
};

module.exports = MultiBocco;
