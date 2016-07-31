
var douban = require('../douban');

douban.getInTheaters().then(function(data) {
	console.log(data);
});