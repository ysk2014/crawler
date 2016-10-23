
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

	/**
	*	返回数据
	*	[
	*		{
	*			mid: 电影id,
	*			mv: 电影所有信息
	*			data: [
	*				{
	*					metakey: metakey,
	*					metavalue: metavalue,
	*					id: metaid
	*				}
	*			]
	*		}
	*	]
	*/

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
	},

	/**
	*	返回数据
	*	{
	*		add: [{
	*			mid: 电影id,
	*			mv: 电影所有信息
	*			data: [
	*				{
	*					metakey: metakey,
	*					metavalue: metavalue,
	*					id: metaid
	*				}
	*			]
	*		}],
	*		update: [{****同上*****}]
	*	}
	*/
	getAllByWeek: function() {

		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth();
		var day = now.getDate();
		var hour = now.getHours();

		var nowWeek = (new Date(year, month, day, hour)).getTime();
		var preWeek = (new Date(year, month, day-7, hour)).getTime();

		return Moviemeta.findAll({
			include: [{ 
				model:Movie, 
				as: 'movie',
				attributes: ['title', 'casts', 'rating','images']
			}],
			where: {
				updatetime: {
					$between: [preWeek, nowWeek]
				}
			}
		}).then(function(data) {
			var rows = {add: [], update: []};
			var cacheMid = {add:[], update: []};

			data.forEach(function(item) {
				item.movie.images = JSON.parse(item.movie.images);
				item.metavalue = JSON.parse(item.metavalue);
				// 本周新添加
				if (item.addtime<=nowWeek && item.addtime>=preWeek) {
					if (cacheMid.add.indexOf(item.mid) > -1) {
						var index = cacheMid.add.indexOf(item.mid);
						rows.add[index].data.push({
							mid: item.mid,
							mv: item.movie,
							data: [{
								metakey: item.metakey,
								metavalue: item.metavalue,
								id: item.id
							}]
						});
					} else {
						rows.add.push({
							mid: item.mid,
							mv: item.movie,
							data: [{
								metakey: item.metakey,
								metavalue: item.metavalue,
								id: item.id
							}]
						});
						cacheMid.add.push(item.mid);
					}
				} else {
					if (cacheMid.update.indexOf(item.mid) > -1) {
						var index = cacheMid.update.indexOf(item.mid);
						rows.update[index].data.push({
							mid: item.mid,
							mv: item.movie,
							data: [{
								metakey: item.metakey,
								metavalue: item.metavalue,
								id: item.id
							}]
						});
					} else {
						rows.update.push({
							mid: item.mid,
							mv: item.movie,
							data: [{
								metakey: item.metakey,
								metavalue: item.metavalue,
								id: item.id
							}]
						});
						cacheMid.update.push(item.mid);
					}
				}
			});

			return rows;
		});
	}
};

