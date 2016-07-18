
var path = require('path');

var logModel = require(path.join(__dirname, '../models/logs'));


var common = function(content, type) {
	var content = content || '';
	var opts = {
		content: content,
		type: type,
		addtime: Math.floor((new Date()).getTime()/1000)
	};
	logModel.add(opts, function(err,data) {
		if (err) console.log(err);
	});
}

module.exports = {
	info: function(content) {
		common(content, 1);
	},
	error: function(content) {
		common(content, 0);
	}
}