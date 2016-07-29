
var cheerio = require('cheerio');
var superagent = require('superagent');


var btbbt = function(info) {

	var arr = [];

	var url = 'http://www.btbbt.cc/search-index-keyword-' + encodeURIComponent(info.title) + '.htm';

	var promise = new Promise((resolve, reject) => {
		superagent.get(url)
			.set('cookie','bbs_sid=ae1595d165c7d24a; bbs_lastday=1469782151; BAIDU_SSP_lcr=https://www.baidu.com/link?url=Hmpn1kCGvMtY6BDiQpjYTDi_fuNefQjVAAztKsxUAaG&wd=&eqid=e47db27a0002a43b00000003579b18a3; cref=1; bbs_lastonlineupdate=1469784905; bbs_page=1; cook_aid=2701; timeoffset=%2B08; CNZZDATA1252895025=808515002-1466500893-null%7C1469783075; a3989_pages=15; a3989_times=2; a3637_pages=30; a3637_times=2')
			.end(function(err,res) {
				var results = {
					error: 2,
					data: 'id为' + info.mid + '的电影爬bt之家数据失败，原因：没有数据',
					from: 'btbbt'
				};

				if (err) {
					var results = {
						error: 1,
						data: 'id为' + info.mid + '的电影爬bt之家数据失败，原因：' + err,
						from: 'btbbt'
					};
					console.log(results.data);
					return resolve(results);
				}

				var $ = cheerio.load(res.text, {decodeEntities: false});
				var $items = $('#threadlist').children('table');

				$items.each(function() {
					var $td = $(this).find('td.subject');

					if ($td.length>0 && $td.find('a').eq(1).html() == '【高清电影】' && $td.find('a').eq(2).html() == '['+info.year+']'){
						var $a = $td.find('a').eq($td.find('a').length-1);
						var text = $a.html();
						var regexp = new RegExp('BT下载','g');

						if (text.indexOf(info.title)>0 && regexp.test(text)) {
							var obj = {};
							obj.href = 'http://www.btbbt.cc/' + $a.attr('href');
							obj.title = text;
							arr.push(obj);
						}
					}
				});

				if (arr.length>0) {
					var results = {
						error: 0,
						from: 'btbbt',
						data: arr
					};
				}

				return resolve(results);
			});
	});
	return promise;
}

module.exports = btbbt;
