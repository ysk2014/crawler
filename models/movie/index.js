
var Sequelize = require('sequelize');

var db = require('../base')('movie');

var Movie = db.define('movie', {
	id   : {
		type: Sequelize.INTEGER(11),
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING(50)
	},
	original_title: {
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
	source: {
		type: Sequelize.INTEGER(1),
		defaultValue: 0
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
	update: function(params) {
		return Movie.findOne({
			where: {
				id: params.mid
			}
		}).then(function(movie) {
			return movie.update({
				source: params.source
			},{
				fields: ['source']
			});
		});
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

