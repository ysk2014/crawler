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

		if (data.length>0) {
			var moviemetaModel = require(path.join(__dirname, '../models/moviemeta'));

			data.forEach(function(item, i) {
				var opt = {
					mid: info.mid,
					metakey: item.from,
					metavalue: JSON.stringify(item.sources)
				};
				moviemetaModel.add(opt, function(err, res) {
					if (err) {
						data.slice(i,1);
					}
				});
			});

			var taskModel = require(path.join(__dirname, '../models/task'));

			var results = info.results ? info.results.split(',') : [];
			var source = require(path.join(__dirname, '../config/app')).source;

			if (_.indexOf(type,'btbbt')>-1) {
				if (data.length + results.length >= source.length+3) {
					taskModel.delByMid(info.mid, function(err, res) {
						if (err) return console.log(err);
					});
				} else {
					var froms = data.map(function(val) {
						return val.from;
					});
					taskModel.update({
						mid: info.mid, 
						results: _.union(results, froms).join(',')
					},function(err, res) {
						if (err) return console.log(err);
					})
				}
			} else {
				if (data.length + results.length == source.length) {
					taskModel.delByMid(info.mid, function(err, res) {
						if (err) return console.log(err);
					});
				} else {
					var froms = data.map(function(val) {
						return val.from;
					});
					taskModel.update({
						mid: info.mid, 
						results: _.union(results, froms).join(',')
					},function(err, res) {
						if (err) return console.log(err);
					})
				}
			}
		}

		var movieInfo = _.clone(info, true);
		movieInfo.data = data;
		movieInfo.error = errors;
		return movieInfo;
	});
};

module.exports = function(data, type, callback) {
	common.mapLimit(data, 2, function(info) {
		return getSingle(info, type);
	}, function(errs, results) {
		if (errs) {
			console.log(errs);
		}

		var email = require(path.join(__dirname, '../email'));

		var errs = [], res = [];
		results.forEach(function(result) {
			if (result.error.length>0) {
				errs.push(result);
			}
			if (result.data.length>0) {
				res.push(result);
			}
		});

		if (errs.length > 0) {
			logger.error(JSON.stringify(errs));
			email.sendErr(errs);
		}

		if (res.length > 0) {
			logger.info(JSON.stringify(res));
			email.sendMovies(res);
		}

		callback && callback();
	});
}


