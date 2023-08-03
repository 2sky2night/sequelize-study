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
  database: 'student-system'
} as Options