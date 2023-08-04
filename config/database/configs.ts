import type { Options } from 'sequelize'

/**
 * 连接数据库的配置项
 */
export default {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'student-system',
  // 配置时区 比国际时间多8小时,只要涉及时间相关的数据都会 +8个小时
  timezone:'+08:00'
} as Options