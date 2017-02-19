
var cheerio = require('cheerio');
var iconv  = require('iconv-lite');
var install = require('superagent-charset');
var request = require('superagent');

var pad = function (number, length, pos) {
	var str = "%" + number;
	while (str.length < length) {
		//向右边补0
		if ("r" == pos) {
			str = str + "0";
		} else {
			str = "0" + str;
		}
	}
	return str;
}

var toHex = function (chr, padLen) {
	if (null == padLen) {
		padLen = 2;
	}
	return pad(chr.toString(16), padLen);
}

function chinese2Gb2312(data) {
	var gb2312 = iconv.encode(data.toString('UCS2'), 'GB2312');
	var gb2312Hex = "";
	for (var i = 0; i < gb2312.length; ++i) {
		gb2312Hex += toHex(gb2312[i]);
	}
	return gb2312Hex.toUpperCase();
}


var dy1234 = function(info) {

	var arr = [];

	var url = 'http://s.imp4la.com/s.asp?w=' + chinese2Gb2312(info.title);

	var promise = new Promise((resolve, reject) => {
		superagent = install(request);
		superagent.get(url).charset('gb2312')
			.set('cookie','ASPSESSIONIDACCDASAT=LNINFDDABDAMEGCKJBOIDGOO; __cfduid=d28d4cc9d3d4943f6054e6c7ba39eded31475380266; CNZZDATA1260327476=1128650047-1475375294-http%253A%252F%252Fwww.dy1234.net%252F%7C1475375294; cscpvrich_fidx=2')
			.end(function(err,res) {
				var results = {
					error: 2,
					data: 'id为' + info.mid + '的电影爬电影家园数据失败，原因：没有数据',
					from: 'dy1234'
				};

				if (err) {
					var results = {
						error: 1,
						data: 'id为' + info.mid + '的电影爬电影家园数据失败，原因：' + (err.stack || err),
						from: 'dy1234'
					};

					console.error('爬取失败，原因：'+(err.stack || err));
					return resolve(results);
				}

				var $ = cheerio.load(res.text, {decodeEntities: false});
				var $movielist = $('#main').find('.movielist .img-list li');


				$movielist.each(function() {
					var obj = {};
					obj.title = '电影家园';

					if ($(this).find('.play-img').attr('title')==info.title && $(this).find('.pLeftTop info').html() == info.year) {
						obj.href = $(this).find('a').attr('href');
						arr.push(obj);
					}
				});

				if (arr.length>0) {
					var results = {
						error: 0,
						from: 'dy1234',
						data: arr
					};
				}

				return resolve(results);
			});
	});
	return promise;
}

module.exports = dy1234;
