

var btbbt = require('../app/movie/source/api/dysfz');

btbbt({
	title: '美人鱼',
	mid: 213213,
	year: 2016
}).then(function(data) {
	console.log(data);
}).catch(function(err) {
	console.log(err);
})