
var douban = require('./douban');

process.on('message', function(id) {
	console.log(id);
	douban.getMovieBaseInfo(id).then(function(data) {
		process.send(data);
		process.disconnect();
	});
})