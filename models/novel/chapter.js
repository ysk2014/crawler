
var Sequelize = require('sequelize');

var db = require('../base')('novel');

var Chapter = db.define('chapter', {
	id   : {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING(30)
	},
    content: {
		type: Sequelize.TEXT
	},
	nid: {
		type: Sequelize.INTEGER(11)
	},
	sid: {
		type: Sequelize.INTEGER(11)
	},
	cid: {
		type: Sequelize.INTEGER(11)
	},
    addtime: {
		type: Sequelize.STRING(20)
	}
});


module.exports = {

	table: Chapter,

	add: function(params) {
		params.addtime = (new Date()).getTime();
		return Chapter.create(params);
	},

    getOne: function(params) {
        return Chapter.findOne({
            where: {
                id: params.id
            }
        })
    }
};

