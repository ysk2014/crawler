
var path = require('path');

var schedule = require('node-schedule');

require(path.join(__dirname, 'global'));

var sourceModel = require(path.join(__dirname, 'models/schedule'));

var App = path.join(ROOT,'app');

function main() {
	console.log('程序开始，获取定时数据');

	sourceModel.getAll().then(function(source) {

		var data = {};
		source.forEach(function(item) {
			if (data[item.type]) {
				data[item.type].push(item);
			} else {
				data[item.type] = [item];
			}
		});
		
		for (var d in data) {
			var ctrl = require(path.join(App,d));
			ctrl(data[d]);
		}

	}).catch(function(err) {
		console.error(err.stack || err);
	});
}


main();

