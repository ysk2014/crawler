var path = require('path');

var getTaskData = function() {
	var promise = new Promise(function(resolve, reject) {
		var taskModel = require(path.join(__dirname, '../models/task'));

		taskModel.getAll(function(err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
	return promise;
}

getTaskData().then(function(data) {
	console.log(data.length);
}).catch(function(err) {
	console.log(err);
})