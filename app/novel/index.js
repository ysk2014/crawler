
let path = require('path');

let { scheduleJob } = require('node-schedule');

let { start } = require(path.join(__dirname, './source'));

module.exports = function(sources) {
    sources.forEach((item, i)=> {
        scheduleJob(item.schedules, ()=> {
            start(item.title);
        });
    });
}