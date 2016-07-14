
var config = require('./config');

var douban = require('./douban');
var fork = require('child_process').fork;

var fs = require('fs');

douban.getMovieInTheaters()
	.then(function(data) {
		return data.subjects.map(function(d) {
			return d.id;
		})
	}).then(function(data) {
		var results = [];
		data.forEach(function(v) {
			var process_bar = fork('./child.js');
			process_bar.send(v);
			process_bar.on('message', function(m) {
				results.push(m);
			})
		});
		return results;
	}).catch(function(err) {
		console.log(err);
	}).then(function(data) {
		console.log(data);
		// var writerStream = fs.createWriteStream('./result.json');
		// writerStream.write(JSON.stringify(data),'UTF8');
		// writerStream.end();
		// writerStream.on('finish', function() {
		// 	console.log("写入完成。");
		// })
	});
