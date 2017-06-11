
var cheerio = require('cheerio');
var superagent = require('superagent');
var pageinfo = require('./info');

class DingDian {
	constructor() {

	}

	start(novel) {
		var _self = this;
		this.novel = novel;
		this.post(novel.source.url+novel.url)
		.then(function(res) {
			return _self.filter(res);
		}).then(function(results) {
			if (results.length>0) {
				console.log(novel.title);
				novel.results = results;
				return pageinfo.start(novel);
			} else {
				return console.log('小说：'+novel.title+'没有更新');
			}
		}).catch(function(err) {
			console.log('《'+novel.title+'》爬虫失败，原因：'+(err.stack || err));
		});
	}

	post(url) {
		console.log(url);
		return new Promise((resolve, reject) => {
			superagent.get(url)
				.end(function(err, res) {
					if (err) {
						return reject(err);
					} else {
						return resolve(res);
					}
				});
		});
	}

	filter(res) {
		var _this = this;
		var $ = cheerio.load(res.text, {decodeEntities: false});
		var $as = $('.card.mt20.fulldir ul.dirlist').find('a');
		var results = [];
		var baseUrl = this.novel.source.url;

		if (this.novel.chapter) {
			if ($as.eq($as.length-1).html() != this.novel.chapter.title) {
				var index = null;
				$as.each(function(i) {
					if ($(this).html() == _this.novel.chapter.title) {
						index = i;
					}
				});
				$as.each(function(i) {
					if (index<i) {
						results.push({
							baseUrl: baseUrl,
							url: $(this).attr('href'),
							title: $(this).html()
						});
					}
				});
			}
		} else {
			$as.each(function() {
				results.push({
					baseUrl: baseUrl,
					url: $(this).attr('href'),
					title: $(this).html()
				});
			});
		}
		return results;
	}
}


module.exports = new DingDian();