'use strict'

var Koa = require('koa');
var generator= require('./wechat/generator');

var config = {
    wechat:{
        appID:'...',
        appSecret:'...',
        token:'...'
    }
};

var app = new Koa();
app.use(generator(config.wechat));
app.listen(3000);