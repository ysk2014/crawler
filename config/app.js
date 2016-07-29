
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
		douban: '0 14 * * *',
		website: {
			'5 14 * * *': ['bttt'],
			'10 14 * * *': ['dytt']
		}
	}
}