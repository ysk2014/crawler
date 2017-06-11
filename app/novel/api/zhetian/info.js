var path = require('path');
var cheerio = require('cheerio');
var superagent = require('superagent');
var throat = require('throat');

var lastChapterModel = require(path.join(ROOT, 'models/novel/lastChapter'));
var chapterModel = require(path.join(ROOT, 'models/novel/chapter'));

class Info {
    start(novel) {
        var _self = this;
        var sources = novel.results;
        this.novel = novel;

        Promise.all(sources.map(throat(10,function(source) {
            return _self.dealSingle(source);
        }))).then(function(results) {
            return _self.addLastChapterData(results[results.length-1]);
        }).catch(function(err) {
            console.log('《'+_self.novel.title+'》爬取来源：'+novel.source.title+'失败，原因：'+(err.stack || err));
        })
    }

    dealSingle(source, index) {
        var _self = this;
        console.log(source.title);
        source.cid = source.url.replace(this.novel.url, '').replace('.html','');
        return this.post(source).then(function(res) {
            return _self.addChapterData(res.info, source);
        }).then(function(data) {
            console.log(source.title+'，爬取结束');
            return data;
        }).catch(function(err) {
            console.error('《'+_self.novel.title+'》爬取章节：'+source.title+'失败，原因：'+(err.stack || err));
            return {err: 1};
        });
    }

    addChapterData(content, source) {
        var _self = this;
        return chapterModel.add({
            title: source.title,
            content: content,
            nid: _self.novel.nid,
            sid: _self.novel.sid,
            cid: source.cid
        })
    }

    post(source) {
        var url = source.baseUrl+source.url
        return new Promise((resolve, reject) => {
            superagent.get(url)
            .end(function(err, res) {
                if (err) {
                    return reject(err);
                } else {
                    var ajaxUrl = source.baseUrl;
                    res.text.replace(/\$\.get\(\'(.+)\'/g, function($1,$2) {
                        ajaxUrl = ajaxUrl+$2;
                    });
                    superagent.get(ajaxUrl).end(function(err1, res1) {
                        if (err1) {
                            return reject(err1);
                        } else {
                            resolve(JSON.parse(res1.text));
                        }
                    })
                    
                }
            })
        });
    }

    addLastChapterData(last) {
        var _self = this;
        return lastChapterModel.update({
            id: _self.novel.id,
            url: _self.novel.url,
            lastid: last.cid
        });
    }
}

module.exports = new Info();