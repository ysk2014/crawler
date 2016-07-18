
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
	}
};

