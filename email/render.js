var path = require('path');
var _ = require('lodash');
var fs = require('fs');


var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;

var emailRoot = join(__dirname,'../views/email');
var base = fs.readFileSync(join(emailRoot, 'base.html'), 'utf8');

module.exports = function(tplName,data) {

	var ext = extname(tplName);

	var filename = tplName;

	if (!ext) {
		ext = '.html';
		filename += ext;
	}

	var tpl = fs.readFileSync(join(emailRoot, filename), 'utf8');
	
	var tplData = _.template(tpl)({data:data});

	return _.template(base)({data: tplData});
}