var path = require('path');

require(path.join(__dirname, 'global'));

var email = require('./email');


email.sendMovies({
	error: 1,
	data: {id:32013, title: 'dsadsa'}
}).then(function(data) {
	console.log(data);
})