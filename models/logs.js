
var Sequelize = require('sequelize');

var db = require('./base');

var Logs = db.define('logs', {
	id   : {
		type: Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey: true
	},
	content: {
		type: Sequelize.TEXT
	},
	type: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	addtime: {
		type: Sequelize.STRING
	}
});


module.exports = {

	table: Logs,
	add: function(params, callback) {
		return Logs.create(params).then(function(data) {
			return callback(null,data);
		}).catch(function(err) {
			return callback(err);
		});
	}
};

