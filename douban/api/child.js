var path = require('path');

require(path.join(__dirname, '../../global'));

var api = require(path.join(__dirname, 'api'));

var movieModel = require(path.join(ROOT, 'models/movie'));

var taskModel = require(path.join(ROOT, 'models/task'));

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
	api.getMovieBaseInfo(id).then(function(data) {
		var data = filterData(data);
		// 存储到movie数据表
		movieModel.add(data, function(err, result) {
			if (err) {
				var info = {error: 1, data: 'id为' + data.id + '插入数据表movie失败，原因:' + err};

				process.send(info);
				process.disconnect();
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
						var info = {error: 1, data: 'id为' + data.id + '插入数据表task失败，原因:' + err};
					} else {
						var info = {error: 0, data: {title: data.title, id: data.id, year: data.year}};
					}

					process.send(info);
					process.disconnect();
				});
			}
		});
	});
}

process.on('message', function(id) {
	getMovieBaseInfo(id);
});
