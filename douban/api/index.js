
var path = require('path');

var fork = require('child_process').fork;

var api = require(path.join(__dirname, 'api'));

var douban = {};

/**
* 开启子进程，爬去单个电影的数据
*
* @param 单个电影的id;
* 
* @return Promise
*/
var openChild = function(id) {
	var promise = new Promise(function(resolve, reject) {
		var child = fork(path.join(__dirname, 'child'));

		child.send(id);

		child.on('message', function(m) {
			resolve(m);
		});

		child.on('error', function(err) {
			resolve({
				error: 1,
				data: '开启电影id为'+id+'的子进程失败，原因：'+err
			});
		});
	});

	return promise;
};


//获取正在热映的详细数据
douban.getInTheaters = function() {

	return api.getMovieInTheaters().then(function(data) {
		return data.subjects.map(function(d) {
			return d.id;
		});
	}).then(function(data) {
		var filterCtrl = require(path.join(__dirname, 'filter'));
		return filterCtrl.filterID(data);
	}).then(function(data) {
		if (data.length>0) {
			return Promise.all(data.map(openChild(id)));
		} else {
			return '';
		}
	});
}

module.exports = douban;






