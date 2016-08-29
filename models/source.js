
var Sequelize = require('sequelize');

var db = require('./base');

var Source = db.define('source', {
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
	addtime: {
		type: Sequelize.STRING(20)
	}
});


module.exports = {

	table: Source,
	add: function(params) {
		return Source.create(params);
	},
	getAll: function() {
		return Source.findAll();
	}
};

