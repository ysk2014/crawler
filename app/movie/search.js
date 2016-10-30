
var path = require('path');

require(path.join(__dirname, '../../global'));

var douban = require(path.join(__dirname, 'douban'));

var source = require(path.join(__dirname, 'source'));

module.exports = {
	//搜索关键字电影
	searchByKeyword: function(keyword) {
		console.log("豆瓣搜索"+keyword+"开始");
		
		return douban.searchMovie(keyword).then(function(data) {
			console.log('豆瓣搜索'+keyword+'结束');

			data[0].mid = data[0].id;

			console.log('资源搜索'+keyword+'开始');

			return source.searchMovie(data[0]).then(function(res) {
				console.log('资源搜索'+keyword+'结束');
				var result = {douban:data,source:res}
				return result;
			}).catch(function(err) {
				console.error('资源搜索'+keyword+'结束');
				console.error(err);
			});
		}).catch(function(err) {
			console.error('豆瓣搜索'+keyword+'结束');
			console.error(err.stack || err);
		});
	},
	//重新爬去单个电影资源
	recrawlingBySource: function(task) {
		return source.recrawling(task);
	},
	//更新豆瓣数据
	recrawlingByDouban: function(mid) {
		console.log('开始更新豆瓣数据');
		return douban.updateInfoBySingle(mid);
	}
};
