import { Sequelize } from 'sequelize'
import configs from './configs';
// 创建seq实例链接数据库
const sequelizeIns = new Sequelize(configs);

(async function () {
  try {
    await sequelizeIns.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelizeIns