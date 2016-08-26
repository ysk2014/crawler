
var Sequelize = require('sequelize');

var db = require('./base');

var Movie = db.define('movie', {
	id   : {
		type: Sequelize.INTEGER(11),
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING(50)
	},
	origin_title: {
		type: Sequelize.STRING(50)
	},
	alt: {
		type: Sequelize.STRING(50)
	},
	images: {
		type: Sequelize.TEXT
	},
	rating: {
		type: Sequelize.STRING(20)
	},
	pubdates: {
		type: Sequelize.STRING(20)
	},
	year: {
		type: Sequelize.STRING(20)
	},
	subtype: {
		type: Sequelize.INTEGER(1),
		defaultValue: 0
	},
	durations: {
		type: Sequelize.STRING(20),
	},
	genres: {
		type: Sequelize.STRING(50),
	},
	countries: {
		type: Sequelize.STRING(20),
	},
	genres: {
		type: Sequelize.STRING,
	},
	summary: {
		type: Sequelize.TEXT
	},
	directors: {
		type: Sequelize.STRING(50)
	},
	casts: {
		type: Sequelize.TEXT
	},
	addtime: {
		type: Sequelize.STRING(20)
	}
});


module.exports = {

	table: Movie,

	add: function(params) {
		params.addtime = Math.floor((new Date()).getTime());
		return Movie.create(params);
	},
	checkIds: function(ids) {
		return Movie.findAll({
			attributes: ['id'],
			where: {
				id: {
					$in: ids
				}
			}
		});
	}
};

