var path = require('path');
var api = require(path.join(__dirname, 'api'));
var movieModel = require(path.join(ROOT, 'models/movie'));
var taskModel = require(path.join(ROOT, 'models/movie/task'));

/**
* 对电影数据进行处理，使其符合存储数据库的格式
*
* @param object;
* 
* @return object
*/
var filterData = function(data) {

	data.casts = data.casts.map(function(d) {
		return d.name;
	}).join();

	data.directors = data.directors.map(function(d) {
		return d.name;
	}).join();

	data.countries = data.countries.join();

	data.genres = data.genres.join();

	data.images = JSON.stringify(data.images);

	data.rating = data.rating.average;

	data.subtype = data.subtype == 'movie' ? 0 : 1;

	return data;

}

var getMovieBaseInfo = function(id) {
	var promise = new Promise(function(resolve, reject) {
		api.getMovieBaseInfo(id).then(function(data) {
			var data = filterData(data);
			// 存储到movie数据表
			movieModel.add(data).then(function(result) {
				var opt = {
					mid: id,
					title: data.title,
					year: data.year,
					addtime: Math.floor((new Date()).getTime()/1000)
				};
				//添加task数据表
				return taskModel.add(opt);
			}).then(function(res) {
				resolve({title: data.title, id: data.id, year: data.year});
			}).catch(function(err) {
				reject('id为' + data.id + '插入数据失败，原因:' + err);
			});
		}).catch(function(err) {
			console.error(err);
		});
	});
	return promise;
}

module.exports = function(ids, callback) {
	mapLimit(ids, 4, function(id) {
		return getMovieBaseInfo(id);
	}, function(errs, results) {
		if (errs.length > 0) {
			logger('movie').error(JSON.stringify(errs), 1);
		}

		if (results.length > 0) {
			logger('movie').info(JSON.stringify(results), 1);
		}
	});
}