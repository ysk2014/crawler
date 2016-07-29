var path = require('path');
var http = require('http');
require(path.join(__dirname, '../global'));

var email = require('../email');

var data = [
	{
		"id": 13123,
		"title": "绝地逃亡",
		"info": {
			"rating": "7.0",
			"images": {
				"small":"https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2367559705.jpg",
				"large":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2367559705.jpg",
				"medium":"https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2367559705.jpg"
			},
			"casts": "伊利亚·伍德,伊利亚·伍德,伊利亚·伍德"
		},
		"data": [
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			},
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			},
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			}
		]
	},
		{
		"id": 13123,
		"title": "绝地逃亡",
		"info": {
			"rating": "7.0",
			"images": {
				"small":"https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2367559705.jpg",
				"large":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2367559705.jpg",
				"medium":"https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2367559705.jpg"
			},
			"casts": "伊利亚·伍德,伊利亚·伍德,伊利亚·伍德"
		},
		"data": [
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			},
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			},
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			}
		]
	},
		{
		"id": 13123,
		"title": "绝地逃亡",
		"info": {
			"rating": "7.0",
			"images": {
				"small":"https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2367559705.jpg",
				"large":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2367559705.jpg",
				"medium":"https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2367559705.jpg"
			},
			"casts": "伊利亚·伍德,伊利亚·伍德,伊利亚·伍德"
		},
		"data": [
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			},
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			},
			{
				"from": "bttt",
				"source": [
					{
						"title": "绝地逃亡",
						"href": "http://walle.taihenw.com/task/index"
					}

				]
			}
		]
	},
];


http.createServer(function(req, res) {

	res.writeHead(200, {'Content-Type': 'text/html'});

	res.write(email.render(data));
	res.end();
}).listen(3000);

