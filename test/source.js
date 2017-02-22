
var path = require('path');

require(path.join(__dirname, '../global'));

var source = require(path.join(__dirname, '../app/movie/source'));

var type = [{
	title: 'BT之家',
	code:'btbtt',
	type: 'movie',
	times: 1,
	id: 2
}];

source.getDownloads(type);