
var path = require('path');

var movieMetaModel = require(path.join(ROOT, 'models/movie/moviemeta'));

var email = require(path.join(ROOT, 'email'));

module.exports = function() {
	return movieMetaModel.getAllByWeek().then(function(data) {
		return email.sendMovies('week',data);
	});
}