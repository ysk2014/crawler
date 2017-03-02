
var path = require('path');

global.Promise = require('bluebird');



global._ = require('lodash');

global.ROOT = __dirname;

// global.console.log = function(content) {
// 	var now = new Date();
// 	var time = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
// 	process.stdout.write('['+time+'] '+content+'\n');
// }

global.logger = require(path.join(__dirname, 'log'));

global.mapLimit = function(coll, limit, iteratee, callback) {
	var _arr = [];
	var current = limit>coll.length ? coll.length-1 : limit-1;
	var results = [];
	var errors = [];

	var delEnd = function() {
		if (current < coll.length) {
			fun(coll[current++]);
		}

		if (coll.length== errors.length + results.length) {
			if (callback) return callback(errors, results);
		}
	}

	var fun = function(id) {
		if (_arr.length < limit) {
			var promise = iteratee(id);

			_arr.push(promise);

			var len = _arr.length;

			promise.then(function(data) {

				results.push(data);
				_arr.splice(0, 1);

				delEnd();
			}).catch(function(err) {
				errors.push(err);
				_arr.splice(0, 1);

				delEnd();
			});
		}
	}

	var _len = limit>coll.length ? coll.length : limit
	for (var i = 0; i < _len; i++) {
		fun(coll[i]);
	}
}
