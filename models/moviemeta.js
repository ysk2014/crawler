
var Sequelize = require('sequelize');

var db = require('./base');

var Moviemeta = db.define('moviemeta', {
	id   : {
		type: Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey: true
	},
	mid: {
		type: Sequelize.INTEGER
	},
	metakey: {
		type: Sequelize.STRING
	},
	metavalue: {
		type: Sequelize.TEXT
	}
});


module.exports = {

	table: Moviemeta,

	add: function(params, callback) {
		return Moviemeta.create(params).then(function(data) {
			return callback(null,data);
		}).catch(function(err) {
			return callback(err);
		});
	},
	update: function(params, callback) {
		return Moviemeta.findOne({
			where: {
				mid: params.mid,
				metakey: params.metakey
			}
		}).then(function(task) {
			if (task) {
				return task.update({
					metavalue: params.metavalue
				},{
					fields: ['metavalue']
				}).then(function(data) {
					return callback(null,data);
				}).catch(function(err) {
					return callback(err);
				});
			} else {
				return Moviemeta.create(params).then(function(data) {
					return callback(null,data);
				}).catch(function(err) {
					return callback(err);
				});
			}
		}).catch(function(err) {
			return callback(err);
		});
	},
	getAll: function(params, callback) {
		return Moviemeta.findAll({
			where: {
				mid: params.mid,
				metakey: {
					$in: params.from
				}
			}
		}).then(function(data) {
			return callback(null, data);
		}).catch(function(err) {
			return callback(err);
		});
	}
};

