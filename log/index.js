
var path = require('path');

var logModel = require(path.join(__dirname, '../models/logs'));


var common = function(content, subtype, type) {
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

module.exports = {
	info: function(content, subtype) {
		common(content, subtype, 1);
	},
	error: function(content, subtype) {
		common(content, subtype, 0);
	}
}
