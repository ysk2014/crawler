
var cheerio = require('cheerio');
var superagent = require('superagent');


var bttt = function(info) {

	var arr = [];

	var url = 'http://www.bttiantang.com/s.php';

	var promise = new Promise((resolve, reject) => {
		superagent.get(url)
			.set('cookie','__cfduid=d8df091c5ea8ffbd911ca58a753be8f191468850191; cf_clearance=a4a433d14b111b786d1d592bc196af1dbaafd5e5-1468850195-1800; bdshare_firstime=1468850196067; adClass0803=2; CNZZDATA5933609=cnzz_eid%3D528086647-1468846495-http%253A%252F%252Fwww.bttiantang.com%252F%26ntime%3D1468846495; cscpvrich_fidx=2')
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
					form: 'bttt'
				};

				if (err) {
					var results = {
						error: 1,
						data: 'id为' + info.mid + '的电影爬bt天堂数据失败，原因：' + err,
						form: 'bttt'
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
						obj.title = $title.find('.tt').children('a').html();

						var desc = $title.children('p.des').html();
						var regexp = new RegExp(info.year,'g');

						if (obj.title.indexOf(info.title)>=0 && regexp.test(desc)) {
							obj.href = 'http://www.bttiantang.com' + $title.find('.tt').children('a').attr('href');
							arr.push(obj);
						}
					}
				});

				if (arr.length>0) {
					var results = {
						error: 0,
						form: 'bttt',
						data: {id: info.mid, sources: arr}
					};
				}

				return resolve(results);
			});
	});
	return promise;
}

module.exports = bttt;
