
var cheerio = require('cheerio');
var superagent = require('superagent');


var rarbt = function(info) {

	var arr = [];

	var url = 'http://www.rarbt.com/index.php/search/index.html?search='+encodeURIComponent(info.title);

	var promise = new Promise((resolve, reject) => {
		superagent.get(url)
			.set('cookie','PHPSESSID=iosj5r42lcvtta9adeofnbss15; bdshare_firstime=1475381937763; JXM705699=1; JXD705699=1; BAIDU_SSP_lcr=https://www.baidu.com/link?url=uMlQe2Cd7aICg65Th4xCNRrDRgcVK8vrhRtwZqPyRsK&wd=&eqid=80ca539100099c000000000357f08a40; cscpvcouplet_fidx=1; Hm_lvt_f913d8d669e587a819e4434b2314f732=1475381938,1475381978,1475382041,1475382187; Hm_lpvt_f913d8d669e587a819e4434b2314f732=1475382191')
			.end(function(err,res) {
				var results = {
					error: 2,
					data: 'id为' + info.mid + '的电影爬rarbt中文站数据失败，原因：没有数据',
					from: 'rarbt'
				};

				if (err) {
					var results = {
						error: 1,
						data: 'id为' + info.mid + '的电影爬rarbt中文站数据失败，原因：' + err,
						from: 'rarbt'
					};
					return resolve(results);
				}

				var $ = cheerio.load(res.text, {decodeEntities: false});
				var $items = $('.mb.cl .ml .item');

				$items.each(function() {
					if ($(this).find('.title').length>0) {
						var obj = {};
						var $title = $(this).find('.title');
						obj.title = 'rarbt中文站';

						var desc = $title.children('p.des').html();
						var regexp = new RegExp(info.year,'g');

						if ($title.length>0 && $title.find('.tt.cl').find('a').attr('title') == info.title && regexp.test(desc)) {
							obj.href = 'http://www.rarbt.com' + $title.find('.tt').children('a').attr('href');
							arr.push(obj);
						}
					}
				});

				if (arr.length>0) {
					var results = {
						error: 0,
						from: 'rarbt',
						data: arr
					};
				}
				return resolve(results);
			});
	});
	return promise;
}

module.exports = rarbt;
