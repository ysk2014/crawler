

var bttt = require('../source/api/bttt');

bttt({
	title: '三人行',
	mid: 213213,
	year: 2016
}).then(function(data) {
	console.log(data.data.sources);
})