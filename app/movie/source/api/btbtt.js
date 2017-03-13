
var cheerio = require('cheerio');
var superagent = require('superagent');

var btbtt = function(info) {

	var arr = [];

	var url = 'http://www.btbtt.co/search-index-keyword-' + encodeURIComponent(info.title) + '.htm';

	var promise = new Promise((resolve, reject) => {
		superagent.get(url)
			.set('cookie','bbs_sid=ae1595d165c7d24a; cook_aid=10706; bbs_lastday=1471431970; visid_incap_871584=kHsMaLu5SPO1oOtBISUFeSFFtFcAAAAAQUIPAAAAAADnUCr41F/SnuNxvVHalO4h; incap_ses_434_871584=j1leEwgbFmxlKEOd0eAFBiFFtFcAAAAA5rfDZRZPEw5uYv8VS7gcEQ==; bbs_lastonlineupdate=1471431979; timeoffset=%2B08; CNZZDATA1252895025=808515002-1466500893-null%7C1471428253; a3989_pages=2; a3989_times=4; a3637_pages=4; a3637_times=4')
			.end(function(err,res) {
				var results = {
					error: 2,
					data: 'id为' + info.mid + '的电影爬bt之家数据失败，原因：没有数据',
					from: 'btbtt'
				};

				if (err) {
					var results = {
						error: 1,
						data: 'id为' + info.mid + '的电影爬bt之家数据失败，原因：' + (err.stack || err),
						from: 'btbtt'
					};
					console.error('爬取失败，原因：'+(err.stack || err));
					return resolve(results);
				}

				var $ = cheerio.load(res.text, {decodeEntities: false});
				var $items = $('#threadlist').children('table');

				$items.each(function() {
					var $td = $(this).find('td.subject');

					if ($td.length>0 && $td.find('a').eq(2).html() == '['+info.year+']'){
						var aLen = $td.find('a').length;

						if ($td.find('a').eq(1).html() == '【高清电影】') {
							var $a = $td.find('a').eq(aLen-1);
							var _title = $td.find('a').eq(aLen-2).html().replace(/[\[\]]/g,'');
							var _text = $a.html().match(/(\d+\.\d+G)/g);

							if ($a.html().indexOf(info.title)>0 && _text && _text.length>0 && _text[0]!='') {
								var obj = {};
								obj.href = 'http://www.btbtt.co/' + $a.attr('href');
								obj.title = _title+'/'+_text[0];
								arr.push(obj);
							}

						} else if ($td.find('a').eq(1).html() == '【电影】') {
							var $a = $td.find('a').eq(aLen-1);
							var text = $a.attr('title').replace(/\[/g,']').split(']');
							var textArr = _.compact(text);

							console.log(textArr);
							if (textArr[1] == '<span class=red>'+info.title+'</span>') {
								var obj = {};
								obj.href = 'http://www.btbtt.co/' + $a.attr('href');
								obj.title = textArr[2]+'/'+textArr[3]+'/'+textArr[4];
								arr.push(obj);
							}
						}
					}
				});
				if (arr.length>0) {
					var results = {
						error: 0,
						from: 'btbtt',
						data: arr
					};
				}
				return resolve(results);
			});
	});
	return promise;
}

module.exports = btbtt;
