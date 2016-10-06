/**
*  封装豆瓣电影API
*
*/

var superagent = require('superagent');

//抓取数据
var spider = function (url) {
	var promise = new Promise(function(resolve, reject) {
		superagent.get(url).end(function(err, res) {
			if (err) return reject(err);
			return resolve(res.body);
		});
	});

	return promise;
}

var douban = function (opts) {
	this.opts = opts;
	this.base_url = 'https://api.douban.com/v2/movie/';
}

//获取电影条目信息
douban.prototype.getMovieBaseInfo = function(id) {
	var url = this.base_url + 'subject/' + id;
	return spider(url);
}
// 电影剧照
douban.prototype.getMoviePhotos = function() {
	var url = this.base_url + 'subject/' + id +'/photos';
	return spider(url);
}
//搜索电影
douban.prototype.searchMovie = function(keyword, type) {
	var url = this.base_url + 'search?' + type + '=' + encodeURIComponent(keyword);
	return spider(url);
}
//获取正在热映的电影
douban.prototype.getMovieInTheaters = function() {
	var url = this.base_url + 'in_theaters';
	return spider(url);
}

douban.prototype.getMovieCommingSoon = function() {
	var url = this.base_url + 'coming_soon';
	return spider(url);
}

douban.prototype.getMovieTop250 = function() {
	var url = this.base_url + 'top250';
	return spider(url);
}

douban.prototype.getMovieUsBox = function() {
	var url = this.base_url + 'us_box';
	return spider(url);
}

douban.prototype.getMovieWeekly = function() {
	var url = this.base_url + 'weekly';
	return spider(url);
}

douban.prototype.getMovieNew = function() {
	var url = this.base_url + 'new_movies';
	return spider(url);
}


module.exports = new douban();
