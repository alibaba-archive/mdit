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


describe('mdit.test.js', function() {
  describe('#toSlides', function() {
    var dirname = path.dirname(__dirname);
    var filepath = path.join(dirname, 'example', 'slides_demo.md');
    var savepath = mdit.toSlides(filepath);
    savepath.should.include('slides_demo.html');
    path.existsSync(savepath).should.be.true;
    fs.unlinkSync(savepath);
  });
});