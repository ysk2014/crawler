
var Sequelize = require('sequelize');

var db = require('../base')('myadmin');

var Logs = db.define('logs', {
	id: {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	content: {
		type: Sequelize.TEXT
	},
	mode: {
		type: Sequelize.STRING(20)
	},
	type: {
		type: Sequelize.INTEGER(1),
		defaultValue: 0   //crawler
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

