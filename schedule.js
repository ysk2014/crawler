
var path = require('path');

var schedule = require('node-schedule');

var task = function() {
	return schedule.scheduleJob('* 19 * * *', function() {

		require(path.join(__dirname, 'app'));
	});
}

task();