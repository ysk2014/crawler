var path = require('path');
var http = require('http');
require(path.join(__dirname, '../global'));

var email = require('../email');

var data = [ { mv: 
     { images: '{"small":"https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2361744534.jpg","large":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2361744534.jpg","medium":"https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2361744534.jpg"}',
       rating: '6.6',
       casts: '季冠霖,苏尚卿,许魏洲,金士杰' },
    id: 3,
    mid: 5045678,
    title: '大鱼海棠',
    year: '2016',
    type: 0,
    results: null,
    addtime: '1469518958',
    data: [ { from: 'bttt', sources: [ {
    	title: '3243',
    	href: 'dsadsadsa'
    } ] } ],
    error: [] },
  { mv: 
     { images: '{"small":"https://img1.doubanio.com/view/movie_poster_cover/ipst/public/p2361036748.jpg","large":"https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2361036748.jpg","medium":"https://img1.doubanio.com/view/movie_poster_cover/spst/public/p2361036748.jpg"}',
       rating: '5.4',
       casts: '包贝尔,宋佳,朱亚文,焦俊艳' },
    id: 7,
    mid: 25849006,
    title: '陆垚知马俐',
    year: '2016',
    type: 0,
    results: null,
    addtime: '1469518958',
    data: [ { from: 'bttt', sources: [ {
    	title: '3243',
    	href: 'dsadsadsa'
    } ] } ],
    error: [] },
  { mv: 
     { images: '{"small":"https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2358403173.jpg","large":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2358403173.jpg","medium":"https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2358403173.jpg"}',
       rating: '5.5',
       casts: '李敏镐,钟汉良,唐嫣,徐正曦' },
    id: 16,
    mid: 21941770,
    title: '赏金猎人',
    year: '2016',
    type: 0,
    results: null,
    addtime: '1469518959',
    data: [ { from: 'bttt', sources: [ {
    	title: '3243',
    	href: 'dsadsadsa'
    } ] } ],
    error: [] },
  { mv: 
     { images: '{"small":"https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2366570716.jpg","large":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2366570716.jpg","medium":"https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2366570716.jpg"}',
       rating: '7.8',
       casts: '陈永忠,谢理循,余世学,郭月' },
    id: 26,
    mid: 26337866,
    title: '路边野餐',
    year: '2015',
    type: 0,
    results: null,
    addtime: '1469638805',
    data: [ { from: 'bttt', sources: [ {
    	title: '3243',
    	href: 'dsadsadsa'
    } ] } ],
    error: [] } ];



http.createServer(function(req, res) {

	res.writeHead(200, {'Content-Type': 'text/html'});

	res.write(email.render(data));
	res.end();
}).listen(3000);

