
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

var dytt = function(info) {
	var arr = [];
	var url = 'http://s.dydytt.net/plus/search.php?keyword=' + chinese2Gb2312(info.title);

	var promise = new Promise(function(resolve, reject) {
		superagent = install(request);
		superagent.get(url).charset('gb2312').end(function(err,res) {
			
			var results = {
				error: 2,
				data: 'id为' + info.mid + '的电影爬电影天堂数据失败，原因：没有数据',
				from: 'dytt'
			};

			if (err) {
				var results = {
					error: 1,
					data: 'id为' + info.mid + '的电影爬电影天堂数据失败，原因：' + (err.stack || err),
					form: 'dytt'
				};
				console.error('爬取失败，原因：'+(err.stack||err));
				return resolve(results);
			}

			var $ = cheerio.load(res.text, {decodeEntities: false});
			var $ul = $('.bd3r .co_content8').children('ul');
			var len = $ul.find('table').length;
			

			if (len>0) {
				$ul.find('table').each(function() {

					var $title = $(this).find('tr').eq(0).find('td').eq(1).find('a');
					var desc = $(this).find('tr').eq(1).find('td').eq(0).html();
					var regexp = new RegExp(info.year,'g');

					if ($title.length>0 && $title.html().indexOf('《')>=0) {
						var title = $title.html().split('《')[1];
						if (title.indexOf('<font color="red">'+info.title+'</font>')==0 && regexp.test(desc)) {
							var obj = {};
							obj.title = '电影天堂';
							obj.href = 'http://s.dydytt.net' + $title.attr('href');
							arr.push(obj);
						}
					}
				});
			}

			if (arr.length>0) {
				var results = {
					error: 0,
					from: 'dytt',
					data: arr
				};
			}

			console.log('结果：'+results.data);
			return resolve(results);
		});
	});
	return promise;
}

module.exports = dytt;
