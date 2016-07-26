
var path = require('path');

var sources = require(path.join(__dirname, '../config/app')).source;

var source = {};

/**
* 获取任务数据
*
* 
* @return array
*/
var getTaskData = function() {
	var promise = new Promise(function(resolve, reject) {
		var taskModel = require(path.join(__dirname, '../models/task'));

		taskModel.getAll(function(err, res) {
			if (err) reject(err);

			resolve(res);
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
source.getDownloads = function() {
	return getTaskData().then(function(data) {
		var child = require(path.join(__dirname, 'child'));
		child(data);
	}).catch(function(err) {
		console.log(err);
	});
}

module.exports = source;






