
var cheerio = require('cheerio');
var iconv  = require('iconv-lite');
var install = require('superagent-charset');
var request = require('superagent');
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
			var superagent = install(request);
			superagent.get(url).charset('gb2312')
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
		var $as = $('table#at').find('a');
		var results = [];
		var baseUrl = this.novel.source.url+this.novel.url;

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