
var path = require('path');

var common = function(logModel, content, subtype, type) {
	var content = content || '';
	var opts = {
		content: content,
		type: type,
		subtype: subtype,
		addtime: Math.floor((new Date()).getTime()/1000)
	};
	logModel.add(opts).catch(function(err) {
		console.log(err);
	});
}

module.exports = function(type) {

	if (type && type=='movie') {
		var logModel = require(path.join(__dirname, '../models/movie/logs'));
	} else {
		var logModel = require(path.join(__dirname, '../models/logs'));
	}
	return {
		info: function(content, subtype) {
			common(logModel, content, subtype, 1);
		},
		error: function(content, subtype) {
			common(logModel, content, subtype, 0);
		}
	}
}