var path = require('path');
var common = require(path.join(__dirname, '../common'));


/**
* 获取单个任务的下载资源
*
* @param object 单个任务的信息数据;
* 
* @return array
*/
var getDownload = function(info, type) {
	return Promise.all(type.map(function(name) {
		var item = require(path.join(__dirname, 'api/'+name));
		return item(info);
	}));
}


var getSingle = function(info, type) {
	return getDownload(info, type).then(function(results) {

		var errors = [], data = [];
		// 获取下载资源数据，过滤错误的信息
		results.forEach(function(result) {
			if (result.error == 0) {
				data.push({from:result.from, sources: result.data});
			} else if (result.error == 1) {
				errors.push({from:result.from, data: result.data});
			}
		});

		var movieInfo = _.clone(info, true);
		movieInfo.data = data;
		movieInfo.error = errors;
		return movieInfo;
	});
};

// 入库
var saveData = function(movieInfo) {
	var moviemetaModel = require(path.join(__dirname, '../models/moviemeta'));
	var taskModel = require(path.join(__dirname, '../models/task'));

	var results = movieInfo.results ? movieInfo.results.split(',') : [];

	var froms = movieInfo.data.map(function(val) {
		return val.from;
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
		return taskModel.update({
			mid: movieInfo.mid, 
			results: _.union(results, froms).join(',')
		});
	});
};

module.exports = function(data, type, callback) {
	common.mapLimit(data, 2, function(info) {
		return getSingle(info, type);
	}, function(errs, results) {
		var email = require(path.join(__dirname, '../email'));

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
			logger.error(JSON.stringify(errors));
			email.sendErr(errors);
		}

		if (res.length > 0) {
			Promise.all(res.map(function(item) {
				return saveData(item);
			})).then(function() {
				logger.info(JSON.stringify(res));
				email.sendMovies(res);
				callback && callback();
			}).catch(function(err) {
				console.log(err);
				email.sendErr(err);
				callback && callback();
			});
		} else {
			callback && callback();
		}
		
	});
}


