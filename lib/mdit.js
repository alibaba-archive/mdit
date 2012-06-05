/*!
 * mdit - mdit
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var markdown = require('./showdown');
var fs = require('fs');
var path = require('path');

function _savePath(filepath, ext) {
  return filepath.replace(/\.md/i, ext);
}

exports.toSlides = function (filepath, layout) {
  var dirname = path.dirname(__dirname);
  layout = layout || path.join(dirname, 'slides.tpl.html');
  var slides = markdown.parse(fs.readFileSync(filepath, 'utf-8')).split('<hr />\n');
  var title = slides[0].split('\n', 1)[0].replace(/\<[^>]+\>/ig, ' ');
  var html = '';
  for (var i = 0, l = slides.length; i < l; i++) {
    var slide = slides[i];
    html += '\n<section class="slide">' + slide + '</section>\n';
  };
  var tpl = fs.readFileSync(layout, 'utf-8');
  var savePath = _savePath(filepath, '.html');
  html = tpl.replace('#title#', title).replace('#slides#', html);
  fs.writeFileSync(savePath, html);
  return savePath;
};

exports.toHTML = function (filepath, layout) {
  var savePath = _savePath(filepath, '.html');
  var md = fs.readFileSync(filepath, 'utf-8');
  var title = md.split('\n', 1)[0].substring(1).trim() || ''; // skip `#`
  var content = markdown.parse(md);
  var tpl = fs.readFileSync(layout, 'utf-8');
  fs.writeFileSync(savePath, tpl.replace('#content#', content).replace('#title#', title));
  return savePath;
};