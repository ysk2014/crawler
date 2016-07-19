
var path = require('path');

var fork = require('child_process').fork;

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
		return Promise.all(data.map(function(d) {
			var promise = new Promise(function(resolve, reject) {
				var child = fork(path.join(__dirname, 'child'));

				child.send(d); //单个电影任务的数据信息

				child.on('message', function(m) {
					resolve(m);
				});

				child.on('error', function(err) {
					resolve({
						error: 1,
						data: '开启电影id为'+d.id+'的下载资源的子进程失败，原因：'+err
					});
				});
			});

			return promise;
		}));
	})
}

module.exports = source;






