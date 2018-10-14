var sha1 = require('sha1');
var rawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');

module.exports = function(opts){
    var wechat = new Wechat(opts);
    return function *(next){
        var token = opts.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        var str = [token,timestamp,nonce].sort().join('');
        var sha = sha1(str);

        if (this.method === 'GET')
            this.body = (sha === signature) ? echostr + '' : 'failed';
        else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'failed';
                return false;
            }

            var data = yield rawBody(this.req, {length:  this.length, limit: '1mb',encoding:this.charset});

            console.log('perry data: ', data);

            var content = yield util.parseXMLAsync(data);
            
            var message = util.formatMessage(content.xml);

            this.weixin = message;

            yield handler.call(this, next);

            wechat.replay.call(this);
        }
    };
}