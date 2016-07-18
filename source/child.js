var path = require('path');

require(path.join(__dirname, '../global'));

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

process.on('message', function(info) {
	getDownload(info).then(function(results) {

		// 获取下载资源数据，过滤错误的信息
		var data = results.map(function(result) {
			if (result.error == 0) {
				return {data:result.data, form: result.form};
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

		process.send(data);
		process.disconnect();
	});
});


