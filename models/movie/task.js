var Sequelize = require('sequelize');

var path = require('path');

var db = require('../base')('movie');

var Task = db.define('task', {
	id   : {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	mid: {
		type: Sequelize.INTEGER(11)
	},
	title: {
		type: Sequelize.STRING(30)
	},
	year: {
		type: Sequelize.STRING(20)
	},
	type: {
		type: Sequelize.INTEGER(1),
		defaultValue: 0
	},
	results: {
		type: Sequelize.TEXT
	},
	addtime: {
		type: Sequelize.STRING(20)
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
	getAllByResults: function(types,start,end) {

		var sql = "select task.*, movie.images, movie.rating, movie.casts from task join movie on task.mid=movie.id where task.results is NULL";

		types.forEach(function(item, i) {
			if (item.times>0) {
				if (i==0) {
					sql += " or task.results like '%"+ item.code +"%'";
				} else {
					sql += " and task.results like '%"+ item.code +"%'";
				}
			} else {
				if (i==0) {
					sql += " or task.results not like '%"+ item.code +"%'";
				} else {
					sql += " and task.results not like '%"+ item.code +"%'";
				}
			}
		});

		sql += " and task.addtime between "+start+" and "+end;
		
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