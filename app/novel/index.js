
var path = require('path');

var schedule = require('node-schedule');

var source = require(path.join(__dirname, './source'));

module.exports = function(sources) {
    sources.forEach(function(item, i) {
        schedule.scheduleJob(item.schedules, function() {
            source.start(item.title);
        });
    }, this);
}