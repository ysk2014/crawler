
var Sequelize = require('sequelize');

var db = require('./base')('myadmin');

var Schedule = db.define('schedule', {
	id: {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING(30)
	},
	code: {
		type: Sequelize.STRING(20)
	},
	schedules: {
		type: Sequelize.STRING(30)
	},
	type: {
		type: Sequelize.STRING(20)
	},
	times: {
		type: Sequelize.INTEGER(1),
		defaultValue: 0
	},
	close: {
		type: Sequelize.INTEGER(1),
		defaultValue: 0
	},
	addtime: {
		type: Sequelize.STRING(20)
	}
});


module.exports = {

	table: Schedule,
	add: function(params) {
		return Schedule.create(params);
	},
	getAll: function() {
		return Schedule.findAll({
			where: {
				close: 0
			}
		}).catch(function(err) {
			console.error(err);
		});
	}
};

