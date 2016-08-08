
var Sequelize = require('sequelize');

var db = require('./base');

var Task = db.define('task', {
	id   : {
		type: Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey: true
	},
	mid: {
		type: Sequelize.INTEGER
	},
	title: {
		type: Sequelize.STRING
	},
	year: {
		type: Sequelize.STRING
	},
	type: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	results: {
		type: Sequelize.STRING
	},
	addtime: {
		type: Sequelize.STRING
	}
});


module.exports = {

	table: Task,

	add: function(params, callback) {
		return Task.create(params).then(function(data) {
			return callback(null,data);
		}).catch(function(err) {
			return callback(err);
		});
	},

	getAll: function(callback) {
		return Task.findAll().then(function(data) {
			return callback(null, data);
		}).catch(function(err) {
			return callback(err);
		});
	},
	getAllByResults: function(type, callback) {
		var source = require(path.join(__dirname, '../config/app')).source;

		var sql = "select task.*, movie.images, movie.rating, movie.casts from task join movie on task.mid=movie.id where ";

		type.forEach(function(item, i) {
			if (!source[type[i]].class) {
				if (i==0) {
					sql += " results not like '%"+ item +"%'";
				} else {
					sql += " and results not like '%"+ item +"%'";
				}
			}
		});

		sql += " or results is NULL";

		return db.query(sql).then(function(data) {
			var results = [];
			data[0].forEach(function(item) {
				var obj = {};
				obj.mv = {};
				var cur = 0;
				for (var name in item) {
					if (cur < 7) {
						obj[name] = item[name];
					} else {
						obj['mv'][name] = item[name];
					}
					cur++;
				}
				results.push(obj);
			});
			
			return callback(null, results);
		}).catch(function(err) {
			return callback(err);
		});
	},
	delByMid: function(mid, callback) {
		return Task.destroy({
			where: {
				mid: mid
			}
		}).then(function(data) {
			return callback(null, data);
		}).catch(function(err) {
			return callback(err);
		})
	},
	update: function(params, callback) {
		return Task.findOne({
			where: {
				mid: params.mid
			}
		}).then(function(task) {
			return task.update({
				results: params.results
			},{
				fields: ['results']
			}).then(function(data) {
				return callback(null,data);
			}).catch(function(err) {
				return callback(err);
			});
		}).catch(function(err) {
			return callback(err);
		});
	},
	delByAddtime: function(addtime, callback) {
		return Task.destroy({
			where: {
				addtime: {
					$lt: addtime
				}
			}
		}).then(function(data) {
			return callback(null, data);
		}).catch(function(err) {
			return callback(err);
		})
	}
};

