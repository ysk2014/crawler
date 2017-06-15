
var Sequelize = require('sequelize');

var db = require('../base')('novel');

var Novel = db.define('novel', {
	id   : {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING(30)
	},
	author: {
		type: Sequelize.STRING(20)
	},
    img_url: {
		type: Sequelize.TEXT
	},
	summary: {
		type: Sequelize.TEXT
	},
	sid: {
		type: Sequelize.INTEGER(11)
	},
	addtime: {
		type: Sequelize.STRING(20)
	},
    uptime: {
		type: Sequelize.STRING(20)
	}
});


module.exports = {

	table: Novel,

	add: function(params) {
		params.addtime = Math.floor((new Date()).getTime());
		return Novel.create(params);
	},
	getOne: function(params) {
		return Novel.findOne({
			where: params
		});
	}
};

