var path = require('path');
require(path.join(__dirname, '../global'));
var api = require(path.join(__dirname, 'api'));
var douban = {};

douban.getInTheaters = function() {
	console.log("豆瓣爬虫开始");
	var promise = new Promise(function(resolve, reject) {
		api.getMovieInTheaters().then(function(data) {
			return data.subjects.map(function(d) {
				return d.id;
			});
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
	});

	return promise;
}


module.exports = douban;