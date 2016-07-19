
var path = require('path');

require(path.join(__dirname, 'global'));

var douban = require(path.join(__dirname, 'douban'));

var source = require(path.join(__dirname, 'source'));

douban().then(function(data) {
	return source.getDownloads();
}).then(function(data) {
	if (data.errors) {
		if (_.compact(data.data).length>0) {
			var email = require(path.join(__dirname, 'email'));
			email.sendMovies(_.compact(data.data)).then(function(res) {
				console.log(res);
			});
		}

		if (_.compact(data.errors).length>0) {
			var email = require(path.join(__dirname, 'email'));
			email.sendMovies(_.compact(data.errors)).then(function(res) {
				console.log(res);
			});
		}
	}
	
	console.log('程序结束');
}).catch(function(err) {
	console.log(err);
});
