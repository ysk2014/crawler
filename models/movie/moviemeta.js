
var Sequelize = require('sequelize');

var db = require('../base')('movie');

var Moviemeta = db.define('moviemeta', {
	id   : {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	mid: {
		type: Sequelize.INTEGER(11)
	},
	metakey: {
		type: Sequelize.STRING(20)
	},
	metavalue: {
		type: Sequelize.TEXT
	}
});


module.exports = {

	table: Moviemeta,

	add: function(params) {
		return Moviemeta.create(params);
	},
	update: function(params) {
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
				});
			} else {
				return Moviemeta.create(params);
			}
		});
	},
	getAll: function(params) {
		return Moviemeta.findAll({
			where: {
				mid: params.mid,
				metakey: {
					$in: params.from
				}
			}
		});
	}
};

