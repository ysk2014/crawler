
var path = require('path');

var schedule = require('node-schedule');

require(path.join(__dirname, 'global'));

var sourceModel = require(path.join(__dirname, 'models/source'));


function douban(time) {
	schedule.scheduleJob(time, function() {
		var source = require(path.join(__dirname, 'douban'));
		source.getInTheaters().then(function(data) {
			console.log(data);
		})
	});
}

function website(times) {
	var source = require(path.join(__dirname, 'source'));

	for (var time in times) {
		(function(time, wb) {
			schedule.scheduleJob(time, function() {
				source.getDownloads(wb[time]);
			});
		})(time,times)
	}
}

function delTime() {
	console.log('程序开始，获取定时数据');

	sourceModel.getAll().then(function(source) {
		var data = {douban: '',website: {}};
		source.forEach(function(item) {
			if (item.code == 'douban') {
				data.douban = item.schedules;
			} else {
				if (data['website'][item.schedules]) {
					data['website'][item.schedules].push(item.code);
				} else {
					data['website'][item.schedules] = [item.code];
				}
			}
		});
		douban(data.douban);
		website(data.website);
	}).catch(function(err) {
		console.log(err);
	});
}


delTime();

