
var cheerio = require('cheerio');
var superagent = require('superagent');


var bttt = function(info) {

	var arr = [];

	var url = 'http://www.bttiantang.com/s.php';

	var promise = new Promise((resolve, reject) => {
		superagent.get(url)
			.set('cookie','__cfduid=d8df091c5ea8ffbd911ca58a753be8f191468850191; bdshare_firstime=1468850196067; CNZZDATA1257023383=1605702195-1469188777-http%253A%252F%252Fwww.bttiantang.com%252F%7C1469621345; _ga=GA1.2.1762369992.1469192975; CNZZDATA5934599=cnzz_eid%3D952258636-1469191096-http%253A%252F%252Fwww.bttiantang.com%252F%26ntime%3D1469836630; cscpvcouplet_fidx=2; adClass0803=7; CNZZDATA5933609=cnzz_eid%3D528086647-1468846495-http%253A%252F%252Fwww.bttiantang.com%252F%26ntime%3D1469842085; cscpvrich_fidx=1')
			.query({
				q: info.title,
				sitesearch: 'www.bttiantang.com',
				domains: 'bttiantang.com',
				hl: 'zh-CN',
				ie: 'UTF-8',
				oe: 'UTF-8'
			})
			.end(function(err,res) {
				var results = {
					error: 2,
					data: 'id为' + info.mid + '的电影爬bt天堂数据失败，原因：没有数据',
					from: 'bttt'
				};

				if (err) {
					var results = {
						error: 1,
						data: 'id为' + info.mid + '的电影爬bt天堂数据失败，原因：' + err,
						from: 'bttt'
					};
					console.log(results.data);
					return resolve(results);
				}

				var $ = cheerio.load(res.text, {decodeEntities: false});
				var $items = $('.mb.cl .ml .item');

				$items.each(function() {
					if ($(this).find('.title').length>0) {
						var obj = {};
						var $title = $(this).find('.title');
						obj.title = 'BT天堂';

						var desc = $title.children('p.des').html();
						var regexp = new RegExp(info.year,'g');

						if ($title.length>0 && $title.find('.tt.cl').find('a').html().indexOf(info.title)>=0 && regexp.test(desc)) {
							obj.href = 'http://www.bttiantang.com' + $title.find('.tt').children('a').attr('href');
							arr.push(obj);
						}
					}
				});

				if (arr.length>0) {
					var results = {
						error: 0,
						from: 'bttt',
						data: arr
					};
				}
				return resolve(results);
			});
	});
	return promise;
}

module.exports = bttt;
