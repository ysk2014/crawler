var path = require('path');
require(path.join(__dirname, '../global'));
var btbtt = require('../app/movie/source/api/btbtt');

btbtt({
	title: '三人行',
	mid: 213213,
	year: 2016
}).then(function(data) {
	console.log(data);
}).catch(function(err) {
	console.log(err);
})