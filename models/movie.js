
var Sequelize = require('sequelize');

var db = require('./base');

var Movie = db.define('movie', {
	id   : {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING
	},
	origin_title: {
		type: Sequelize.STRING
	},
	alt: {
		type: Sequelize.STRING
	},
	images: {
		type: Sequelize.TEXT
	},
	rating: {
		type: Sequelize.STRING
	},
	pubdates: {
		type: Sequelize.STRING
	},
	year: {
		type: Sequelize.STRING
	},
	subtype: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	durations: {
		type: Sequelize.STRING,
	},
	genres: {
		type: Sequelize.STRING,
	},
	countries: {
		type: Sequelize.STRING,
	},
	genres: {
		type: Sequelize.STRING,
	},
	summary: {
		type: Sequelize.TEXT
	},
	directors: {
		type: Sequelize.STRING
	},
	casts: {
		type: Sequelize.TEXT
	},
	addtime: {
		type: Sequelize.STRING
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

