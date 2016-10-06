
var path = require('path');

global.Promise = require('bluebird');



global._ = require('lodash');

global.ROOT = __dirname;

global.console.log = function(content) {
	var now = new Date();
	var time = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
	process.stdout.write('['+time+'] '+content+'\n');
}

global.logger = require(path.join(__dirname, 'log'));

global.mapLimit = function(coll, limit, iteratee, callback) {
	var _arr = [];
	var current = limit;
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
				_arr.splice(len-1, 1);

				delEnd();
			}).catch(function(err) {
				errors.push(err);
				_arr.splice(len-1, 1);

				delEnd();
			});
		}
	}

	for (var i = 0; i < limit; i++) {
		fun(coll[i]);
	}
}
