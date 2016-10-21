
var path = require('path');

var logModel = require(path.join(ROOT, 'models/movie/logs'));
var movieMetaModel = require(path.join(ROOT, 'models/movie/moviemeta'));

var email = require(path.join(ROOT, 'email'));

module.exports = function() {
	return logModel.getAllByWeek().then(function(data) {
		var ids = [];
		data.forEach(function(item) {
			JSON.parse(item.content).forEach(function(result) {
				if (ids.indexOf(result.mid)<0) {
					ids.push(result.mid)
				}
			});
		});
		return ids;
	}).then(function(ids) {
		return movieMetaModel.getAllByMids(ids);
	}).then(function(data) {
		return email.sendUserMovies(data);
	}).catch(function(err) {
		console.error(err.stack || err);
	});
}