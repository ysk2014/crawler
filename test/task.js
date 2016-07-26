var taskModel = require(path.join(__dirname, '../models/task'));

taskModel.getAll(function(err, res) {
			if (err) {
				console.log(err);
			} else {
				console.log(res.length);
			}
		});