
module.exports = {
	source: {
		bttt: {
			title: 'bt天堂',
			class: false
		},
		btbbt: {
			title: 'BT之家',
			class: true
		}
	},
	schedules: {
		douban: '0 1 */2 * *',
		website: {
			'0 19 */2 * *': ['bttt'],
			'0 12 */2 * *': ['btbbt']
		}
	}
}