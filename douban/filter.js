
var path = require('path');
var movieModel = require(path.join(__dirname, '../models/movie'));
var filterCtrl = {};

/**
* 过滤掉已储存数据的id
*
* @param array 电影id组成的数组;
* 
* @return array  电影id组成的数组，可能为[]
*/
filterCtrl.filterID = function(data) {
	var promise = new Promise(function(resolve, reject) {
		movieModel.checkIds(data).then(function(res) {
			var result = res.map(function(d) {
				return ''+d.id;
			});

			if (result.length>0) {
				resolve(_.difference(data,result));
			} else {
				resolve(data);
			}
		}).catch(function(err) {
			reject(err);
		});
	});

	return promise;
}

module.exports = filterCtrl;

