var path = require('path');

var api = require(path.join(__dirname, 'api'));

var douban = {};

douban.getInTheaters = function() {
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
				child(data, function(results) {
					console.log(results.length);
				});
			}

			return '';
		});
	});

	return promise;
}


module.exports = douban;