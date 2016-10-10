
var Sequelize = require('sequelize');

var db = require('../base')('movie');

var Logs = db.define('logs', {
	id: {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	content: {
		type: Sequelize.TEXT
	},
	subtype: {
		type: Sequelize.INTEGER(1),
		defaultValue: 0
	},
	type: {
		type: Sequelize.INTEGER(1),
		defaultValue: 1
	},
	addtime: {
		type: Sequelize.STRING(20)
	}
});


module.exports = {

	table: Logs,
	add: function(params) {
		return Logs.create(params);
	},

	getAllByWeek: function() {
		var now = Math.floor((new Date()).getTime()/1000);
		var old = now - 60*60*24*7;
		return Logs.findAll({
			where: {
				addtime: {
					$between: [old, now]
				},
				subtype: 0,
				type: 1
			}
		});
	}
};

