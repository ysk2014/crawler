var superagent = require("superagent");
var schedule = require("node-schedule");
var fs = require("fs");
var path = require("path");

var urls = [
	'https://source.unsplash.com/category/technology',
	'https://source.unsplash.com/category/buildings',
	'https://source.unsplash.com/category/technology',
	'https://source.unsplash.com/category/objects'
];

// 获取单个图片数据
function singleDeal(url, index) {
	var pm = new Promise(function(reslove, reject) {
		superagent.get(url,function(err,res) {
			if (err) {
				console.error(err);
				return reslove(err);
			}

			return reslove({index:index,fileData:res.body});
		});
	});

	return pm;
}

module.exports = function(source) {
	var j = schedule.scheduleJob(source[0].schedules,function() {
		console.log('爬去博客图片开始');

		Promise.all(urls.map(function(url,index) {
			return singleDeal(url,index);
		})).then(function(results) {
			results.forEach(function(result) {
				var writerStream = fs.createWriteStream(path.join(ROOT,'../webquan/public/upload_path/banner/'+result.index+'.jpg'));
				writerStream.write(result.fileData,'UTF8');
				writerStream.end();
				writerStream.on('finish', function() {
			    	console.log('写入完成');
				});
			});
			console.log('爬取博客图片结束');
		}).catch(function(err) {
			console.error('爬取博客图片出错：');
			console.error(err);
		});
	})
}

