
var path = require('path');

var schedule = require('node-schedule');

function douban(time) {
	if (time.length<=0) return false;
	 
	schedule.scheduleJob(time, function() {
		var source = require(path.join(__dirname, 'douban'));
		source.getInTheaters().then(function(data) {
			console.log(data);
		});
	});
}

function website(times) {
	var source = require(path.join(__dirname, 'source'));

	for (var time in times) {
		(function(time, wb) {
			schedule.scheduleJob(time, function() {
				source.getDownloads(wb[time]);
			});
		})(time,times);
	}
}

function sendEmail(time) {
	if (time.length<=0) return false;

	schedule.scheduleJob(time, function() {
		var sendEmail = require(path.join(__dirname, 'sendEmail'));
		sendEmail().then(function(data) {
			console.log(data);
		});
	})
}

module.exports = function(sources) {
	var movieTimes = {douban: '',website: {}, email: ''};
	
	sources.forEach(function(item) {
		if (item.schedules) {
			console.log(item.title);
			if (item.code == 'douban') {
				movieTimes.douban = item.schedules;
			} else if (item.code=='email') {
				movieTimes.email = item.schedules;
			} else {
				if (movieTimes['website'][item.schedules]) {
					movieTimes['website'][item.schedules].push(item);
				} else {
					movieTimes['website'][item.schedules] = [item];
				}
			}
		}
	});

	douban(movieTimes.douban);

	website(movieTimes.website);

	sendEmail(movieTimes.email);
}