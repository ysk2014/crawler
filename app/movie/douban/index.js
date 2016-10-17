var path = require('path');

var api = require(path.join(__dirname, 'api'));
var douban = {};

douban.getInTheaters = function() {
	console.log("豆瓣爬虫开始");
	var promise = new Promise(function(resolve, reject) {
		api.getMovieInTheaters().then(function(data) {
			var ids = [];
			data.subjects.forEach(function(item) {
				if (item.year == (new Date()).getFullYear() && parseFloat(item.rating.average) > 4) {
					ids.push(item.id);
				}
			});
			return ids;
		}).then(function(data) {
			var filterCtrl = require(path.join(__dirname, 'filter'));
			return filterCtrl.filterID(data);
		}).then(function(data) {
			if (data.length>0) {
				var child = require(path.join(__dirname, 'child'));
				child(data);
			}

			resolve('豆瓣爬虫完成');
		});
	}).catch(function(err) {
		console.error(err);
	});

	return promise;
}

douban.searchMovie = function(keyword) {
	
	var promise = new Promise(function(resolve, reject) {
		api.searchMovie(keyword,'q').then(function(data) {
			var movies = [];
			data.subjects.forEach(function(item) {
				if ((item.title == keyword || item.original_title == keyword) && item.subtype=='movie') {
					movies.push(item);
				}
			});
			resolve(movies);
		});
	}).catch(function(err) {
		console.log(err);
	});

	return promise;
}

module.exports = douban;