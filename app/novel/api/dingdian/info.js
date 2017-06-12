var path = require('path');
var cheerio = require('cheerio');
var install = require('superagent-charset');
var request = require('superagent');

var lastChapterModel = require(path.join(ROOT, 'models/novel/lastChapter'));
var chapterModel = require(path.join(ROOT, 'models/novel/chapter'));

class Info {
    start(novel) {
        var _self = this;
        var sources = novel.results;
        this.novel = novel;

        Promise.all(sources.map(function(source) {
            return _self.dealSingle(source);
        })).then(function(results) {
            var err = 0;
            results.forEach(function(item) {
                if (item.err==1) {
                    err = 1;
                }
            });
            if (!err) {
                _self.addLastChapterData(results[results.length-1].id);
            }
        }).catch(function(err) {
            console.log('《'+_self.novel.title+'》爬取来源：'+novel.source.title+'失败，原因：'+(err.stack || err));
        })
    }

    dealSingle(source) {
        var _self = this;
        return this.post(source).then(function(res) {
            return _self.filter(res);
        }).then(function(content) {
            return _self.addChapterData(content);
        }).catch(function(err) {
            console.log('《'+_self.novel.title+'》爬取章节：'+source.title+'失败，原因：'+(err.stack || err));
            return {err: 1};
        });
    }

    addChapterData(content) {
        var _self = this;
        return chapterModel.add({
            title: _self.novel.title,
            content: content,
            nid: _self.novel.nid,
            sid: _self.novel.sid
        })
    }

    post(source) {
        var url = source.baseUrl+source.url
        return new Promise((resolve, reject) => {
            var superagent = install(request);
            superagent.get(url).charset('gb2312')
            .end(function(err, res) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res);
                }
            })
        });
    }

    filter(res) {
        var _self = this;
		var $ = cheerio.load(res.text, {decodeEntities: false});
        return $('#contents').html().replace(/<br>/g, '');
    }

    addLastChapterData(lastid) {
        var _self = this;
        return lastChapterModel.update({
            id: _self.novel.id,
            url: _self.novel.url,
            lastid: lastid
        });
    }
}

module.exports = new Info();