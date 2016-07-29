
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
		douban: '15 14 * * *',
		website: {
			'17 14 * * *': ['bttt'],
			'19 14 * * *': ['dytt']
		}
	}
}