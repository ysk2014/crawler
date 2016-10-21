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
		var item = require(path.join(__dirname, 'api/'+item.code));
		return item(info);
	}));
}


var getSingle = function(info) {
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

		delete info.clawler;
		
		var movieInfo = _.clone(info, true);
		movieInfo.data = data;
		movieInfo.error = errors;
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
		results[val.from] = val.sources.length;
	});

	return Promise.all(movieInfo.data.map(function(item, i) {

		return new Promise(function(resolve, reject) {
			var opt = {
				mid: movieInfo.mid,
				metakey: item.from,
				metavalue: JSON.stringify(item.sources)
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
		});
	});
};

module.exports = function(data, callback) {
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
				email.sendMovies(res);
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
}


