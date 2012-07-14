/*!
 * mdit - mdit.test.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path');
var fs = require('fs');
var mdit = require('../lib/mdit');
var should = require('should');
fs.existsSync = fs.existsSync || path.existsSync;

describe('mdit.test.js', function () {
  it('toSlides()', function () {
    var dirname = path.dirname(__dirname);
    var filepath = path.join(dirname, 'example', 'slides_demo.md');
    var savepath = mdit.toSlides(filepath);
    savepath.should.include('slides_demo.html');
    should.ok(fs.existsSync(savepath));
    // fs.unlinkSync(savepath);
  });
});