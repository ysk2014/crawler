
var path = require('path');

require(path.join(__dirname, 'global'));

var douban = require(path.join(__dirname, 'douban'));

var source = require(path.join(__dirname, 'source'));

douban().then(function(data) {
	return source.getDownloads();
}).then(function(data) {
	console.log('程序结束');
}).catch(function() {
	console.log(err);
});
