var path = require('path');

/**
* 获取单个任务的下载资源
*
* @param object 单个任务的信息数据;
* 
* @return array
*/
var getDownload = function(info) {
	return Promise.all(info.crawler.map(function(item) {
		try {
			console.log('电影《'+info.title+'》爬取'+item.title+'开始');

			var api = require(path.join(__dirname, '/api/'+item.code));
			var getSource = require(path.join(__dirname, '/download/'+item.code));
			return result = api(info).then(function(res) {
				console.log('电影《'+info.title+'》爬取'+item.title+'结束');
				if (res.error == 0) {
					return getSource(res.data).then(function(results) {
						console.log("结果："+data);
						res.data = results;
						return res;
					});
				} else {
					return res;
				}
			});
		} catch(e) {
			console.error('电影《'+info.title+'》爬取'+item.title+'失败，原因：');
			console.error(e.stack || e);
			return e;
		}
	}));
}


var getSingle = function(info) {
	console.log('电影《'+info.title+'》爬虫开始');
	return getDownload(info).then(function(results) {
		var errors = [], data = [];
		// 获取下载资源数据，过滤错误的信息
		results.forEach(function(result) {
			if (result.error == 0) {
				data.push({from:result.from, sources: result.data});
			} else if (result.error == 1) {
				errors.push({from:result.from, data: result.data});
			}
		});

		delete info.crawler;
		var movieInfo = _.clone(info, true);
		movieInfo.data = data;
		movieInfo.error = errors;

		console.log('电影《'+info.title+'》爬虫结束');

		return movieInfo;
	});
};

// 入库
var saveData = function(movieInfo) {
	var moviemetaModel = require(path.join(ROOT, 'models/movie/moviemeta'));
	var movieModel = require(path.join(ROOT, 'models/movie'));
	var taskModel = require(path.join(ROOT, 'models/movie/task'));

	var results = movieInfo.results ? movieInfo.results : {};

	movieInfo.data.forEach(function(val) {
		if (val.from && val.sources) {
			results[val.from] = val.sources.length;
		}
	});
	return Promise.all(movieInfo.data.map(function(item, i) {

		return new Promise(function(resolve, reject) {
			var opt = {
				mid: movieInfo.mid,
				metakey: item.from,
				metavalue: JSON.stringify(item.sources),
				updatetime: (new Date()).getTime(),
				addtime: (new Date()).getTime()
			};
			moviemetaModel.update(opt).then(function(res) {
				resolve(res);
			}).catch(function(err) {
				reject(err);
				movieInfo.data.slice(i,1);
			});
		});
	})).then(function(res) {
		return movieModel.update({
			mid: movieInfo.mid,
			source: 1
		});
	}).then(function(res) {
		return taskModel.update({
			mid: movieInfo.mid, 
			results: JSON.stringify(results)
		}).then(function() {
			return results;
		});
	});
};

module.exports = {
	delAll: function(data, callback) {
		mapLimit(data, 2, function(info) {
			return getSingle(info);
		}, function(errs, results) {
			var email = require(path.join(ROOT, 'email'));

			errs = errs || [];

			var res = [];
			results.forEach(function(result) {
				if (result.error.length>0) {
					errs.push(result);
				}
				if (result.data.length>0) {
					res.push(result);
				}
			});

			if (errs.length > 0) {
				logger('movie').error(JSON.stringify(errs), 0);
				email.sendErr(errs);
			}

			if (res.length > 0) {
				Promise.all(res.map(function(item) {
					return saveData(item);
				})).then(function() {
					logger('movie').info(JSON.stringify(res), 0);
					callback && callback();
				}).catch(function(err) {
					console.error(err.stack || err);
					email.sendErr(err);
					callback && callback();
				});
			} else {
				callback && callback();
			}
			
		});
	},

	delSingle: function(task) {
		return new Promise(function(resolve, reject) {
			getSingle(task).then(function(info) {
				if (info.data.length>0) {
					saveData(info).then(function(results) {
						resolve(results);
					});
				} else {
					reject({msg:'没有数据'});
				}
			});
		});
	}
}


