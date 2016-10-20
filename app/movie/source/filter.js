var path = require('path');
var movieModel = require(path.join(ROOT, 'models/movie'));
var filter = {};


function queryTask(types) {
	var promise = new Promise(function(resolve, reject) {
		var taskModel = require(path.join(ROOT, 'models/movie/task'));
		var time = Math.floor((new Date()).getTime()/1000 - 30*24*60*60);

		taskModel.getAllByResults(types, time).then(function(res) {
			resolve(res);
		}).catch(function(err) {
			reject(err);
		});
	});
	return promise;
}


filter.getTaskData = function(types) {
	
	return queryTask(types).then(function(res) {
		var tasks = [];
		res.forEach(function(task) {
			if (task.results != null) {
				try {
					task.results = JSON.parse(task.results);
				} catch (err) {
					
				}
				
				task.crawler = [];
				types.forEach(function(type) {
					if (!task.results[type.code] || task.results[type.code] < 10) {
						task.crawler.push(type);
					}
				});
				tasks.push(task);
			} else {
				task.crawler = types;
				tasks.push(task);
			}
		});

		return tasks;
	});
}

module.exports = filter;