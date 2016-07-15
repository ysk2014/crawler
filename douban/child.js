
var path = require('path');
var douban = require(path.join(__dirname, './api'));

process.on('message', function(id) {
	douban.getMovieBaseInfo(id).then(function(data) {
		process.send(data);
		process.disconnect();
	});
});