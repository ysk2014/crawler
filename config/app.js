
module.exports = {
	source: [
		{
			code: 'bttt',
			title: 'bt天堂'
		}, {
			code: 'dytt',
			title: '电影天堂'
		}
	],
	schedules: {
		douban: '30 13 * * *',
		website: {
			'40 13 * * *': ['bttt'],
			'50 13 * * *': ['dytt']
		}
	}
}