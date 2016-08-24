
var Sequelize = require('sequelize');

var path = require('path');

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

	add: function(params) {
		return Task.create(params);
	},

	getAll: function() {
		return Task.findAll();
	},
	getAllByResults: function(type,expir) {
		var source = require(path.join(__dirname, '../config/app')).source;

		var sql = "select task.*, movie.images, movie.rating, movie.casts from task join movie on task.mid=movie.id where addtime >= "+expir+" and results is NULL or";

		type.forEach(function(item, i) {
			if (!source[type[i]].class) {
				if (i==0) {
					sql += " results not like '%"+ item +"%'";
				} else {
					sql += " and results not like '%"+ item +"%'";
				}
			}
		});

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
			
			return results;
		});
	},
	delByMid: function(mid) {
		return Task.destroy({
			where: {
				mid: mid
			}
		});
	},
	update: function(params) {
		return Task.findOne({
			where: {
				mid: params.mid
			}
		}).then(function(task) {
			return task.update({
				results: params.results
			},{
				fields: ['results']
			});
		});
	},
	delByAddtime: function(addtime) {
		return Task.destroy({
			where: {
				addtime: {
					$lt: addtime
				}
			}
		});
	}
};

