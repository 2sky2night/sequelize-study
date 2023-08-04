import sequelizeIns from '../../config/database';
import { DataTypes, Model, InferCreationAttributes, InferAttributes, CreationOptional } from 'sequelize';
import { getNowDateString } from '../../utils/tools';
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
  /**
   * 查询班级是否存在
   * @param cid 班级id
   */
  static async checkCidExist (cid: number) {
    const res = await Class.findByPk(cid)
    return res
  }
  /**
   * 查询班级是否存在  返回字段返回字段不包含(deletedAt)
   * @param cid 班级id
   * @returns 
   */
  static async getClassBase (cid: number) {
    const [ classItem ] = await Class.findAll({
      attributes: {
        exclude: [ 'deletedAt' ]
      },
      where: {
        cid
      }
    })
    return classItem ? classItem : null
  }
}

Class.init(
  {
    cid: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    cname: DataTypes.STRING,
    updatedAt: {
      type: DataTypes.DATE,
      get () {
        // 不要 this.updatedAt 因为这样会造成无限递归了，因为你在get函数里面读了自己
        return getNowDateString(this.getDataValue('updatedAt'))
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return getNowDateString(this.getDataValue('createdAt'))
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      get () {
        const temp = this.getDataValue('deletedAt')
        return temp === null ? null : getNowDateString(this.getDataValue('deletedAt'))
      },
    },
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