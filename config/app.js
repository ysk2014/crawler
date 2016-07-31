
module.exports = {
	source: [
		{
			code: 'bttt',
			title: 'bt天堂'
		}, {
			code: 'btbbt',
			title: 'BT之家'
		}
	],
	schedules: {
		douban: '0 1 */2 * *',
		website: {
			'0 19 */2 * *': ['bttt','btbbt']
		}
	}
}