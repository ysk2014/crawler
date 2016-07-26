
var path = require('path');

require(path.join(__dirname, 'global'));

var douban = require(path.join(__dirname, 'douban'));

var source = require(path.join(__dirname, 'source'));

console.log('程序启动');
douban.getInTheaters().then(function(data) {
	console.log('资源启动');
	console.log(data);
	source.getDownloads();
});
