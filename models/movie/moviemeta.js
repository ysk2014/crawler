
var Sequelize = require('sequelize');

var db = require('../base')('movie');
var Movie = require('./index').table;

var Moviemeta = db.define('moviemeta', {
	id   : {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	mid: {
		type: Sequelize.INTEGER(11)
	},
	metakey: {
		type: Sequelize.STRING(20)
	},
	metavalue: {
		type: Sequelize.TEXT
	},
	updatetime: {
		type: Sequelize.STRING(20)
	},
	addtime: {
		type: Sequelize.STRING(20)
	}
});

Moviemeta.belongsTo(Movie, {foreignKey: 'mid'});

module.exports = {

	table: Moviemeta,

	add: function(params) {
		return Moviemeta.create(params);
	},
	update: function(params) {
		return Moviemeta.findOne({
			where: {
				mid: params.mid,
				metakey: params.metakey
			}
		}).then(function(task) {
			if (task) {
				if (task.metavalue != params.metavalue) {
					return task.update({
						metavalue: params.metavalue,
						updatetime: params.updatetime
					},{
						fields: ['metavalue','updatetime']
					});
				} else {
					return true;
				}
			} else {
				return Moviemeta.create(params);
			}
		});
	},
	getAll: function(params) {
		return Moviemeta.findAll({
			where: {
				mid: params.mid,
				metakey: {
					$in: params.from
				}
			}
		});
	},

	getAllByMids: function(ids) {

		return Moviemeta.findAll({
			include: [{ model:Movie, as: 'movie' }],
			where: {
				mid: {
					$in: ids
				}
			}
		}).then(function(data) {
			var rows = [];
			var cacheMid = [];

			data.forEach(function(item) {

				item.movie.images = JSON.parse(item.movie.images);
				item.metavalue = JSON.parse(item.metavalue);

				if (cacheMid.indexOf(item.mid) > -1) {
					var index = cacheMid.indexOf(item.mid);
					rows[index].data.push({
						mid: item.mid,
						mv: item.movie,
						data: [{
							metakey: item.metakey,
							metavalue: item.metavalue,
							id: item.id
						}]
					});
				} else {
					rows.push({
						mid: item.mid,
						mv: item.movie,
						data: [{
							metakey: item.metakey,
							metavalue: item.metavalue,
							id: item.id
						}]
					});
					cacheMid.push(item.mid);
				}
			});

			return rows;
		});
	}
};

