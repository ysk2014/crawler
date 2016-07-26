var taskModel = require(path.join(__dirname, '../models/task'));

taskModel.getAll(function(err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});