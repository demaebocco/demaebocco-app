'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('underscore');

function run(request, response, behavior) {
  var htmlPath = path.join(__dirname, 'html', 'index.html');
  var template = _.template(fs.readFileSync(htmlPath, 'utf8'));
  var html = template({
    boccoDescription: getDescription(behavior, 'bocco'),
    restaurantDescription: getDescription(behavior, 'restaurant'),
    foodChooserDescription: getDescription(behavior, 'foodChooser')
  });

  response.set('Content-Type', 'text/html');
  response.send(html);
  response.end();
}

function getDescription(behavior, name) {
  var item = behavior[name];
  if (item) {
    return item && item.getDescription && item.getDescription();
  } else {
    return undefined;
  }
}

module.exports = {
  run: run
};
