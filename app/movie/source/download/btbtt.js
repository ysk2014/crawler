
var cheerio = require('cheerio');
var superagent = require('superagent');


function getDownloadPage(href) {
	return new Promise((resolve, reject) => {
		console.log('正在获取详情页面');
		superagent.get(href).end((err, res) => {
			if (err) {
				console.error('获取电影详情页面'+href+'失败'+err.stack);
				return resolve({
					err: 1,
					data: href
				});
			}

			var $ = cheerio.load(res.text, {decodeEntities: false});

			var url = $('.attachlist table.noborder').find('a').attr('href');

			if (url) {
				return resolve({
					err: 0,
					data:url
				});
			} else {
				return resolve({
					err: 1,
					data: href
				});	
			}
		})
	})
}

function getDownloadUrl(href) {
	return new Promise((resolve, reject) => {
		console.log('正在获取下载地址');
		superagent.get('http://www.btbtt.co/'+href).end((err, res) => {
			if (err) {
				console.error('获取电影下载页面'+href+'失败'+err.stack);
				return resolve({
					err: 1,
					data: '获取电影下载页面失败'
				});
			}

			var $ = cheerio.load(res.text, {decodeEntities: false});

			var url = $('#body').find('.icon-download').parent('a').attr('href');

			if (url) {
				return resolve({
					err: 0,
					data: url
				});
			} else {
				return reject({
					err: 1,
					data: '没有找到下载链接'
				});				
			}
		});
	})
}


module.exports = function(data, callback) {
	mapLimit(data, 2, function(item) {
		return getDownloadPage(item.href).then(function(res) {
			console.log('获取详情页面结束');
			if (res.err) {
				return res;
			} else {
				return getDownloadUrl(res.data);
			}
			
		}).then(function(result) {
			console.log('获取下载地址结束')
			if (!result.err) {
				item.href = result.data;
			}
			return item;
		});
	}, function(err, results) {
		callback(results);
	});

}