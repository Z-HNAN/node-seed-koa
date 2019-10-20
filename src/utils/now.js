/**
 * 获得当前显示时间
 * [2019-10-20 15:46:30]
 */

const moment = require('moment')

module.exports = () => `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`
