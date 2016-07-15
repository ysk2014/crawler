
var config = require('./config');

var douban = require('./douban');

douban().then(function(data) {
	console.log(data);
})