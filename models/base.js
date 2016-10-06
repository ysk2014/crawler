
var path = require('path');

var settings = require(path.join(__dirname, '../config/database'));


var Sequelize = require('sequelize');

module.exports = function(database) {
    return new Sequelize(database, settings.user, settings.password, {
        define: {
            underscored: false,
            freezeTableName: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false
        },
        dialect: settings.driver,
        host: settings.host,
        maxConcurrentQueries: 120,
        // logging: true
    });
};