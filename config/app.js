
module.exports = {
	source: ['bttt', 'dytt'],
	schedules: {
		douban: '* 1 * * *',
		website: {
			'* 19 */2 * *': ['bttt'],
			'* 2 */7 * *': ['dytt']
		}
	}
}