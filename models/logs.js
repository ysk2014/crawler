
var Sequelize = require('sequelize');

var db = require('./base');

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
	}
};

