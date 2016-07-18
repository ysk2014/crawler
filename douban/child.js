
var path = require('path');

var config = require(path.join(__dirname, '../global'));

var api = require(path.join(__dirname, 'api/index'));

var getInTheaters = function() {
	api.getInTheaters()
		.then(function(data) {
			if (data.length>0) {
				var errors = [], results = [];

				data.forEach(function(d) {
					if (d.error) 
						errors.push(d.data);
					else 
						results.push(d.data);

				});

				if (errors.length>0) {
					logger.error(JSON.stringify(errors));
				}

				if (results.length>0) {
					logger.info(JSON.stringify(results));
				}
				
			} else {
				logger.info('本次没有新增数据');
				console.log('本次没有新增数据');
			}

			process.send('本次爬豆瓣事件结束');
			process.disconnect();

		}).catch(function(err) {
			logger.error('意外错误：'+err);
			console.log(err);

			process.send('');
			process.disconnect();
		});
}


process.on('message', function(m) {
	getInTheaters();
});
