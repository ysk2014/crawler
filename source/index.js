
var path = require('path');

require(path.join(__dirname, '../global'));

var source = {};

/**
* 获取任务数据
*
* 
* @return array
*/
var getTaskData = function(type) {
	var promise = new Promise(function(resolve, reject) {
		var taskModel = require(path.join(__dirname, '../models/task'));
		var time = Math.floor((new Date()).getTime()/1000 - 60*24*60*60);
		
		taskModel.getAllByResults(type, time).then(function(res) {
			resolve(res);
		}).catch(function(err) {
			reject(err);
		});
	});
	return promise;
}

/**
* 开启子进程，获取下载资源
*
* @param array 电影任务的信息数据;
* 
* @return array
*/
source.getDownloads = function(type) {
	console.log(type.join(',')+'：爬虫开始');
	return getTaskData(type).then(function(data) {
		if (data.length>0) {
			
			console.log(data.length);

			var child = require(path.join(__dirname, 'child'));
			child(data, type, function() {
				console.log(type.join(',')+'：爬虫结束');
			});
		} else {
			console.log(type.join(',')+'没有获取到数据, 程序关闭');
		}
	}).catch(function(err) {
		console.log(err);
		logger.error(JSON.stringify(err));
		var email = require(path.join(__dirname, '../email'));
		email.sendErr(err);
		console.log(type.join(',')+'：程序完成');
	});
}

module.exports = source;






