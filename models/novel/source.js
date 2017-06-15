
var Sequelize = require('sequelize');

var db = require('../base')('novel');

var Source = db.define('source', {
	id   : {
		type: Sequelize.INTEGER(11),
		autoIncrement : true,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING(30)
	},
	url: {
		type: Sequelize.STRING(50)
	},
	code: {
		type: Sequelize.STRING(20)
	},
	addtime: {
		type: Sequelize.STRING(20)
	}
});


module.exports = {

	table: Source,

	add: function(params) {
		params.addtime = Math.floor((new Date()).getTime());
		return Source.create(params);
	},

    get: function(params) {
        Source.findOne({
            where: {
                id: params.id
            }
        });
    }
};

