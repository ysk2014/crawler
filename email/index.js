
var path = require('path');
var nodemailer  = require("nodemailer");
var settings = require(path.join(__dirname, '../config/mail'));
// var ejs = require('ejs');


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

var emails = ['1181102772@qq.com', '1185534172@qq.com'];

module.exports = {
	sendMovies: function(data) {
		var promise = new Promise(function(resolve, reject) {
			smtpTransport.sendMail({
			    from    : 'Node.JS<电影爬虫>',
			    to      : emails,
			    subject : '网上正在热映的电影已经有资源',
			    html    : JSON.stringify(data)
			}, function(error, res) {
			    if (error) reject(error);
			    resolve(res);
			});
		});

		return promise;
		
	}
};