
var config = require('./config');

var douban = require('./douban');

douban.getMovieInTheaters().then(function(data) {
	console.log(data);
}).catch(function(err) {
	console.log(err);
})
