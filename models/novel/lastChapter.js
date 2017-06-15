
var Sequelize = require('sequelize');

var db = require('../base')('novel');

var Source = require('./source').table;
var Chapter = require('./chapter').table;

var LastChapter = db.define('last_chapter', {
	id   : {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	nid: {
		type: Sequelize.INTEGER(11)
	},
    sid: {
		type: Sequelize.INTEGER(11)
	},
    lastid: {
		type: Sequelize.INTEGER(11)
	},
	url: {
		type: Sequelize.TEXT
	},
	addtime: {
		type: Sequelize.STRING(20)
	},
    uptime: {
		type: Sequelize.STRING(20)
	}
});

LastChapter.belongsTo(Source, {foreignKey: 'sid'});
LastChapter.belongsTo(Chapter, {foreignKey: 'lastid'});

module.exports = {

	table: LastChapter,

	add: function(params) {
		params.addtime = params.uptime = (new Date()).getTime();
		return LastChapter.create(params);
	},
	update: function(params) {
		LastChapter.findOne({
            where: {
                id: params.id
            }
        }).then(function(chapter) {
			return chapter.update({
				lastid: params.lastid,
				url: params.url,
				uptime: (new Date()).getTime()
			},{
				fields: ['lastid','url','uptime']
			});
		});
	},
    getOne: function(params) {
        return LastChapter.findOne({
            where: {
                nid: params.nid
            }
        });
    },
	getAll: function(params) {
		return LastChapter.findAll({
			include: [{ 
				model:Source, 
				as: 'source',
				attributes: ['title', 'url', 'code']
			},{ 
				model:Chapter, 
				as: 'chapter',
				attributes: ['title', 'content']
			}],
			where: params
		});
	}
};

