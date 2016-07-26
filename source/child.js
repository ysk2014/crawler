var path = require('path');
var common = require(path.join(__dirname, '../common'));
var source = require(path.join(__dirname, '../config/app')).source;

/**
* 获取单个任务的下载资源
*
* @param object 单个任务的信息数据;
* 
* @return array
*/
var getDownload = function(info) {
	var results = info.results ? info.results.split(',') : [];
	return Promise.all(_.difference(source, results).map(function(name) {
		var item = require(path.join(__dirname, 'api/'+name));
		return item(info);
	}));
}

var getSingle = function(info) {
	return getDownload(info).then(function(results) {

		var errors = [], data = [];
		// 获取下载资源数据，过滤错误的信息
		results.forEach(function(result) {
			if (result.error == 0) {
				data.push(result);
			} else if (result.error == 1) {
				errors.push(result);
			}
		});

		data = _.compact(data);

		if (data.length>0) {
			var moviemetaModel = require(path.join(__dirname, '../models/moviemeta'));

			data.forEach(function(item, i) {
				var opt = {
					mid: info.mid,
					metakey: item.form,
					metavalue: JSON.stringify(item)
				};
				moviemetaModel.add(opt, function(err, res) {
					if (err) {
						data.slice(i,1);
					}
				});
			});

			var taskModel = require(path.join(__dirname, '../models/task'));

			var results = info.results ? info.results.split(',') : [];

			if (data.length + results.length == source.length) {
				taskModel.delByMid(info.mid, function(err, res) {
					if (err) console.log(err);
				});
			} else {

				var forms = data.map(function(val) {
					return val.form;
				});
				taskModel.update({
					mid: info.mid, 
					results: _.union(results, forms).join(',')
				},function(err, res) {
					if (err) console.log(err);
				})
			}
		}

		return {data:data, errors: errors};
	});
};

module.exports = function(data, callback) {
	common.mapLimit(data, 2, function(info) {
		return getSingle(info);
	}, function(errs, results) {
		var email = require(path.join(__dirname, '../email'));

		var errs = [], res = [];
		results.forEach(function(result) {
			if (result.errors.length>0) {
				errs.push(result.errors);
			}
			if (result.data.length>0) {
				res.push(result.data);
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


