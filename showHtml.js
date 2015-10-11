'use strict';

var fs = require('fs');
var path = require('path');

function run(request, response) {
  var htmlPath = path.join(__dirname, 'html', 'index.html');
  var html = fs.readFileSync(htmlPath, 'utf8');

  response.set('Content-Type', 'text/html');
  response.send(html);
  response.end();
}

module.exports = {
  run: run
};
