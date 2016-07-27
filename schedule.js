
var path = require('path');

var schedule = require('node-schedule');

require(path.join(__dirname, 'global'));

var config = require(path.join(__dirname, 'config/app'));

var douban = function() {
	schedule.scheduleJob(config.schedules.douban, function() {
		var source = require(path.join(__dirname, 'douban'));
		source.getInTheaters().then(function(data) {
			console.log(data);
		})
	});
}

var website = function() {
	var source = require(path.join(__dirname, 'source'));

	for (var time in config.schedules.website) {
		schedule.scheduleJob(time, function() {
			source.getDownloads(config.schedules.website[time]);
		});
	}
}

var start = function() {
	douban();
	website();
}

console.log('程序开始');
start();