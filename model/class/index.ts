import sequelizeIns from '../../config/database';
import { DataTypes, Model, InferCreationAttributes, InferAttributes, CreationOptional } from 'sequelize';

/**
 * 班级模型
 */
class Class extends Model<InferAttributes<Class>, InferCreationAttributes<Class>>  {
  // 类型定义 CreationOptional为创建或更新时可以传入的选项
  declare cid: CreationOptional<number>;
  declare cname: string;
  declare deletedAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
}

Class.init(
  {
    cid: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    cname: DataTypes.STRING,
    deletedAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
  },
  {
    // 将模型链接到？
    sequelize: sequelizeIns,
    // 模型名称
    modelName: 'Class',
    // 强制表名和模型一致
    freezeTableName: true,
    // 开启软删除
    paranoid: true,
    // 开启软删除
    deletedAt: true
  }
)

// 创建表
Class.sync()


export default Class