
var path = require('path');
var nodemailer  = require("nodemailer");
var _ = require('lodash');
var fs = require('fs');
var settings = require(path.join(__dirname, '../config/mail'));
var source = require(path.join(__dirname, '../config/app')).source;


var user = settings.username, pass = settings.password;

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: pass
    }
});


var render = function(data) {
	var tpl = fs.readFileSync(path.join(__dirname, '../views/email/info.html'), 'utf8');
	var base = fs.readFileSync(path.join(__dirname, '../views/email/base.html'), 'utf8');
	var tplData = _.template(tpl)({data:data, source: source});
	return _.template(base)({data: tplData});
}

module.exports = {
	sendMovies: function(data) {
		var promise = new Promise(function(resolve, reject) {
			smtpTransport.sendMail({
			    from    : 'Node.JS<'+user+'>',
			    to      : settings.to,
			    subject : '网上正在热映的电影已经有资源',
			    html    : render(data)
			}, function(error, res) {
			    if (error) {
			    	reject(error);
			    } else {
			    	resolve(res);
			    }
			});
		});

		return promise;
	},
	sendErr: function(data) {
		var promise = new Promise(function(resolve, reject) {
			smtpTransport.sendMail({
			    from    : 'Node.JS<'+user+'>',
			    to      : user,
			    subject : '电影爬虫出错列表',
			    html    : JSON.stringify(data)
			}, function(error, res) {
			    if (error) return reject(error);
			    resolve(res);
			});
		});

		return promise;
	}
};