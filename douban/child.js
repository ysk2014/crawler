var path = require('path');

require(path.join(__dirname, '../global'));

var common = require(path.join(__dirname, '../common'));

var api = require(path.join(__dirname, 'api'));

var movieModel = require(path.join(__dirname, '../models/movie'));

var taskModel = require(path.join(__dirname, '../models/task'));

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
	return api.getMovieBaseInfo(id).then(function(data) {
		var data = filterData(data);
		// 存储到movie数据表
		movieModel.add(data, function(err, result) {
			if (err) {
				return {error: 1, data: 'id为' + data.id + '插入数据表movie失败，原因:' + err};
			} else {
				var opt = {
					mid: id,
					title: data.title,
					year: data.year,
					addtime: Math.floor((new Date()).getTime()/1000)
				};
				//添加task数据表
				taskModel.add(opt, function(err, res) {

					if (err) {
						return {error: 1, data: 'id为' + data.id + '插入数据表task失败，原因:' + err};
					} else {
						return {error: 0, data: {title: data.title, id: data.id, year: data.year}};
					}
				});
			}
		});
	});
}

module.exports = function(ids, callback) {
	common.mapLimit(ids, 4, function(id) {
		return getMovieBaseInfo(id);
	}, function(errs, results) {
		callback(results);
	});
}