
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
		douban: '* 1 * * *',
		website: {
			'* 19 */2 * *': ['bttt'],
			'* 2 */7 * *': ['dytt']
		}
	}
}