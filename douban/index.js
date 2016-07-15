
var fork = require('child_process').fork;
var path = require('path');
var douban = require(path.join(__dirname,'./api'));


module.exports = function() {
	return douban.getMovieInTheaters()
		.then(function(data) {
			return data.subjects.map(function(d) {
				return d.id;
			})
		}).then(function(data) {
			return Promise.all(data.map(function(v) {
				var promise = new Promise(function(resolve, reject) {
					var process_bar = fork(path.join(__dirname,'child.js'));
					process_bar.send(v);
					process_bar.on('message', function(m) {
						resolve(m);
					})
				});

				return promise;
			}));
		}).catch(function(err) {
			console.log(err);
		});
}