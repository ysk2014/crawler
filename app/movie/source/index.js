
var path = require('path');
var fs = require('fs');

var source = {};

/**
* 获取任务数据
*
* 
* @return array
*/
var getTaskData = function(types) {
	var promise = new Promise(function(resolve, reject) {
		var taskModel = require(path.join(ROOT, 'models/movie/task'));
		var time = Math.floor((new Date()).getTime()/1000 - 60*24*60*60);
		
		taskModel.getAllByResults(types, time).then(function(res) {
			resolve(res);
		}).catch(function(err) {
			reject(err);
		});
	});
	return promise;
}


var requireDir = function(dir) {
	var promise = new Promise(function(resolve, reject) {
		fs.readdir(dir, function(err, files) {
			if (err) return reject(err);

			return resolve(files);
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
source.getDownloads = function(types) {
	console.log('资源爬虫开始');
	return getTaskData(types).then(function(data) {
		if (data.length>0) {
			
			console.log(data.length);

			var child = require(path.join(__dirname, 'child'));
			child(data, types, function() {
				console.log('资源爬虫结束');
			});
		} else {
			console.log('没有获取到数据, 资源爬虫关闭');
		}
	}).catch(function(err) {
		console.log(err);
		logger('movie').error(JSON.stringify(err));
		var email = require(path.join(ROOT, 'email'));
		email.sendErr(err);
		console.log('资源爬虫结束');
	});
};


source.searchMovie = function(info) {
	return requireDir(path.join(__dirname,'api/')).then(function(files) {
		return Promise.all(files.map(function(file) {
			var item = require(path.join(__dirname, 'api/'+file));
			return item(info);
		}));
	});
}

module.exports = source;






