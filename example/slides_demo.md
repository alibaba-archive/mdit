# UnitTest in Nodejs 实战Nodejs单元测试

---

## 大纲

* 为什么要单元测试
* Nodejs的单元测试模块
* 实战短址还原的单元测试
* QA: 知乎者也

---

## 为什么要单元测试

### 代码质量

代码质量如何度量？
如果没有测试你如何保证你的代码质量？

### 敏捷快速地适应需求

单元测试是否也能让产品经理看得懂？
单元测试是否也能成功一个产品需求的Case？

### 重构

你有足够信心在没有单元测试的情况下发布你的重构代码吗？
如何检测你重构的代码符合需要？

### 增强自信心

全是绿灯！
单元测试全部跑通！

---

## 眼花缭乱的Nodejs测试模块

![unit test in npm](http://ww1.sinaimg.cn/large/6cfc7910jw1doil8n1kq0j.jpg)
[Testing / Spec Frameworks](https://github.com/joyent/node/wiki/modules#wiki-testing)

* [nodeunit](https://github.com/caolan/nodeunit) TDD
* [Expresso](https://github.com/visionmedia/expresso) TDD (Be sure to check out Expresso's successor Mocha.)
* [Vows](https://github.com/cloudhead/vows) BDD
* [Mocha](https://github.com/visionmedia/mocha) BDD
* [should](https://github.com/visionmedia/should.js) BDD

BDD: behaviour-driven development

---

## 如何选择

* 示例完整，上手容易，特别是本身就带有很好的示例
* 文档完善
* 在许多项目中被使用
* 准确友好的测试报告
* 持续改进

---

## Mocha ，我喜欢

![Mocha's Features](http://ww2.sinaimg.cn/large/6cfc7910jw1doimelmi7hj.jpg)

强大的特性列表

* browser support | 浏览器支持
* simple async support | 非常简单自然地支持异步方式
* maps uncaught exceptions to the correct test case | 将未捕获异常对应到正确的测试用例
* test-specific timeouts | 能指定具体测试超时时间
* reports test durations | 测试时间报告
* highlights slow tests | 慢测试高亮显示
* use any assertion library you want | 使用任意你想使用的断言库
* extensible reporting, bundled with 9+ reporters | 可扩展的报告，并默认自动9中报告格式
* before, after, before each, after each hooks | 各种想当然的钩子方法
* ......

---

## should.js 我应该

我承认，我是@TJ 忠实粉丝...
还有，我喜欢 should 的方式:

* 代码写起来有意思
* 让懂英文的产品经理能基本看懂测试用例

---

# A cup of `Mocha`, <br/>test cases `should` pass.

---

## 实战短址还原的单元测试

短址还原: [urlrar](https://github.com/fengmk2/urlrar)

---

## 代码目录，创建响应空文件

* lib/
  * urllib.js
* test/
  * support/
    * http.js (非常方便地测试 http 请求)
  * app.test.js
  * mocha.opts
  * urllib.test.js
* app.js
* index.html
* Makefile
* package.json
* RERAME.md

---

## Makefile

    SRC = $(shell find lib -type f -name "*.js")
    TESTS = test/*.js
    TESTTIMEOUT = 5000
    REPORTER = spec

    test:
      @NODE_ENV=test ./node_modules/.bin/mocha \
        --reporter $(REPORTER) --timeout $(TESTTIMEOUT) $(TESTS)

    .PHONY: test

---

## mocha.opts

    --require node_modules/should
    --require test/support/http.js
    --growl

---

## 方便进行 http 测试

`test/support/http.js`

    app.request()
    .get('/foo')
    .set('x-userid', 'mk2')
    .end(function(res) {
      res.should.be.ok;
      res.statusCode.should.equal(200);
      res.should.status(200);
      res.body.should.be.an.instanceof(Buffer);
      res.headers.should.be.a('object');
      res.should.have.header('X-Power-By', 'Nodejs');
      res.should.have.not.header('Set-Cookie');
    });

---

## 确定需求和应用功能

### 需求

* 将一个短网址 http://t.cn/StVkqS 还原得到最原始网址 http://nodejs.org/community/
* 有一个应用主页面
* 提供API，并支持浏览器能直接调用

### 应用功能

* 短网址还原应用
* 主页面显示介绍和表单，用户可以输入短网址，提交后显示还原结果
* 支持JSONP的短还原API

---

## 行为驱动开发: 实现 “主页面显示介绍和表单” 

直接写测试吧：`test/app.test.js` 

    var app = require('../app');

    describe('urlrar app', function() {
      before(function(done) {
        app.listen(0, done);
      });

---

## 将需求变成测试用例

      it('GET / should response 200 status', function(done) {
        app.request().get('/').end(function(res) {
          res.should.status(200);
          res.should.header('X-Power-By', 'Nodejs');
          var body = res.body.toString();
          // 主页面显示介绍和表单
          body.should.include('<title>Shorten URL Expand</title>');
          body.should.include('<form');
          body.should.include('</form>');
          body.should.include('<input');
          done();
        });
      });
    });

---

## 疯了吧？！直接运行测试

    $ make test

![first test error](http://ww4.sinaimg.cn/large/6cfc7910jw1doiqgenjt8j.jpg)

---

## 实现app.js

    var http = require('http');
    var parse = require('url').parse;
    var fs = require('fs');

    var indexHtml = fs.readFileSync('./index.html');

    var app = http.createServer(function(req, res) {
      res.setHeader('X-Power-By', 'Nodejs');
      var info = parse(req.url, true);
      if (info.pathname === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.end(indexHtml);
      } 
    });

    module.exports = app;

---

## 再次运行测试

    $ make test

![index page run success](http://ww3.sinaimg.cn/large/6cfc7910jw1doiqk4qnvtj.jpg)

---

## 将应用API和404页面完成

![3 more tests](http://ww4.sinaimg.cn/large/6cfc7910jw1doiqorpn1zj.jpg)

---

# QA: 知乎者也