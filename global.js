
var path = require('path');

global.Promise = require('bluebird');

global.logger = require(path.join(__dirname, 'log'));

global._ = require('lodash');

global.ROOT = __dirname;

