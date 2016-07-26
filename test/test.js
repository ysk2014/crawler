var path = require('path');

require(path.join(__dirname, '../global'));

var email = require('../email');


email.sendErr({
	error: 1,
	data: {id:32013, title: 'dsadsa'}
}).then(function(data) {
	console.log(data);
}).catch(function(err) {
	console.log(err);
})