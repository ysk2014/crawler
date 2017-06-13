
var path = require('path');
var novelModel = require(path.join(ROOT, 'models/novel'));
var lastChapterModel = require(path.join(ROOT, 'models/novel/lastChapter'));


class Source {

    start(title) {
        novelModel.getOne({
            title: title
        }).then(function(novel) {
            return lastChapterModel.getAll({
                sid: novel.sid,
                nid: novel.id
            });
        }).then(function(novelSource) {
            novelSource.forEach(function(item) {
                item.title = title;
                var ss = require(path.join(__dirname, './api/'+item.source.code));
                if (item.url) {
                    ss.start(item);
                } else {
                    ss.search(item);
                }
            }, this);
        }).catch(function(err) {
            console.log('《'+title+'》爬虫失败，原因：'+(err.stack || err));
        });
    }
}


module.exports = new Source();