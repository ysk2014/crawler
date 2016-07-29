
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
			'* 14 * * *': ['bttt'],
			'30 14 * * *': ['dytt']
		}
	}
}