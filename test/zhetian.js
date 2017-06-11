var path = require('path');
var cheerio = require('cheerio');
var superagent = require('superagent');

var post = function() {
    return new Promise((resolve, reject) => {
        superagent.get('http://www.zhetian.org/1361/104.html')
        .end(function(err, res) {
            if (err) {
                return reject(err);
            } else {
                // var $ = cheerio.load(res.text, {decodeEntities: false});
                var url = 'http://www.zhetian.org';
                console.log(11);
                res.text.replace(/\$\.get\(\'(.+)\'/g, function($1,$2) {
                    url += $2;
                });
                superagent.get(url).end(function(err1, res1) {
                    if (err1) {
                        return reject(err1);
                    } else {
                        resolve(JSON.parse(res1.text).info);
                    }
                });
            }
        })
    });
}

post().then(function(content) {
    console.log(content);
}).catch(function(err) {
    console.log(err);
})