
var cheerio = require('cheerio');
var superagent = require('superagent');


var dysfz = function(info) {

	var arr = [];

	var url = 'http://www.dysfz.net/key/'+encodeURIComponent(info.title)+'/';

	var promise = new Promise((resolve, reject) => {
		superagent.get(url)
			.set('cookie','PHPSESSID=ulerdo67r0lut184h2d1c51td6; JXM702591=1; JXD702591=1; Hm_lvt_cdc0fcfb23d9418f796a886b04754729=1475504600; Hm_lpvt_cdc0fcfb23d9418f796a886b04754729=1475737256')
			.end(function(err,res) {
				var results = {
					error: 2,
					data: 'id为' + info.mid + '的电影爬电影首发站数据失败，原因：没有数据',
					from: 'rarbt'
				};

				if (err) {
					var results = {
						error: 1,
						data: 'id为' + info.mid + '的电影爬电影首发站数据失败，原因：' + err,
						from: 'rarbt'
					};
					return resolve(results);
				}

				var $ = cheerio.load(res.text, {decodeEntities: false});
				var $items = $('.main .movie-list>li');

				$items.each(function() {
					var $li = $(this);
					var douban = false;
					$(this).find('.txt.fr p>a').each(function() {
						if ($(this).html()=='豆瓣' && $(this).attr('href').indexOf(info.mid)) {
							douban = true;
						}
					});
					if (douban) {
						var obj = {};
						obj.title = '电影首发站';
						obj.href = $li.find('h2 a').attr('href');
						arr.push(obj);
						return false;
					}

					if ($li.find('.txt.fr p>span').eq(1).html().indexOf(info.year)>0) {
						var obj = {};
						obj.title = '电影首发站';
						obj.href = $li.find('h2 a').attr('href');
						arr.push(obj);
						return false;
					}
					
				});

				if (arr.length>0) {
					var results = {
						error: 0,
						from: 'dysfz',
						data: arr
					};
				}
				return resolve(results);
			});
	});
	return promise;
}

module.exports = dysfz;
