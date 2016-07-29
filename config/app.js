
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
		douban: '0 1 */2 * *',
		website: {
			'0 19 */2 * *': ['bttt'],
			'10 1 */7 * *': ['dytt']
		}
	}
}