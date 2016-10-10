
var path = require('path');

var logModel = require(path.join(ROOT, 'models/movie/logs'));

var email = require(path.join(ROOT, 'email'));

module.exports = function() {
	return logModel.getAllByWeek().then(function(data) {
		console.log(data);
	});
}