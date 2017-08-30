
let path = require('path');
let { getOne } = require(path.join(ROOT, 'models/novel'));
let { getAll } = require(path.join(ROOT, 'models/novel/lastChapter'));


class Source {

    start(title) {
        getOne({
            title: title
        }).then((novel)=> {
            return getAll({
                sid: novel.sid,
                nid: novel.id
            });
        }).then((novelSource) => {
            novelSource.forEach((item)=> {
                item.title = title;
                let { start, search } = require(path.join(__dirname, './api/'+item.source.code));
                if (item.url) {
                    start(item);
                } else {
                    search(item);
                }
            });
        }).catch((err)=> {
            console.log('《'+title+'》爬虫失败，原因：'+(err.stack || err));
        });
    }
}


module.exports = new Source();