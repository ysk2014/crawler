var path = require('path');
var movieModel = require(path.join(ROOT, 'models/movie'));
var filter = {};


function queryTaskAll(types) {
	var promise = new Promise(function(resolve, reject) {
		var taskModel = require(path.join(ROOT, 'models/movie/task'));
		var now = Math.floor((new Date()).getTime()/1000);
		var end = now- 7*24*60*60 - 45*24*60*60 - 45*24*60*60;
		var start = end - 45*24*60*60;

		taskModel.getAllByResults(types, start, end).then(function(res) {
			resolve(res);
		}).catch(function(err) {
			reject(err);
		});
	});
	return promise;
}

/**
*	[
*		{
*			id,mid,title,year,result:{},
*			crawler:[{
*				code: 'btbtt',
*			}]
*		}
*	]
*/
filter.getTaskData = function(types) {
	
	return queryTaskAll(types).then(function(res) {
		var tasks = [];
		res.forEach(function(task) {
			if (task.results != null) {
				try {
					task.results = JSON.parse(task.results);
				} catch (err) {
					console.log(err);
				}
				
				task.crawler = [];
				types.forEach(function(type) {
					if (!task.results[type.code] || task.results[type.code] < 10) {
						task.crawler.push(type);
					}
				});
				
				if (task.crawler.length>0) {
					tasks.push(task);
				}
			} else {
				task.crawler = types;
				tasks.push(task);
			}
		});

		return tasks;
	});
};
/**
*	参数是task表的一条记录
*   return 
*/

filter.getTaskBySingle = function(task) {
	var sourceModel = require(path.join(ROOT, 'models/schedule'));

	return sourceModel.getAllBySource().then(function(types) {

		types.forEach(function(type, index) {
			if (type.code=='douban' || type.code=="email") {
				types.splice(index,1);
			}
		});

		if (task.results != null) {
			task.crawler = [];

			try {
				task.results = JSON.parse(task.results);
			} catch (err) {
				console.log(err);
			}

			types.forEach(function(type) {
				if (!task.results[type.code] || task.results[type.code] < 10) {
					task.crawler.push(type);
				}
			});
		
		} else {
			task.crawler = types;
		}
		return task;
	});
}

module.exports = filter;