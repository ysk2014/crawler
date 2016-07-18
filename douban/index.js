
var path = require('path');

var fork = require('child_process').fork;

module.exports = function() {
	var promise = new Promise(function(resolve, reject) {
		var child = fork(path.join(__dirname, 'child'));

		child.send('start');

		child.on('message', function(m) {
			console.log(m);
			resolve();
		});

		child.on('error', function(err) {
			console.log(err);
			resolve();
		});
	});

	return promise;
}