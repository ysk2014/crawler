
var cheerio = require('cheerio');
var superagent = require('superagent');


var bttt = function(info) {

	var arr = [];

	var url = 'http://www.bttiantang.com/s.php?q=' + encodeURI(info.title);

	var promise = new Promise((resolve, reject) => {
		superagent.get(url).end(function(err,res) {
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
