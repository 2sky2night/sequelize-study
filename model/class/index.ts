import sequelizeIns from '../../config/database';
import { DataTypes, Model, InferCreationAttributes, InferAttributes, CreationOptional, HasManyGetAssociationsMixin, HasManyCreateAssociationMixin, HasManyRemoveAssociationMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin } from 'sequelize';
import { getNowDateString } from '../../utils/tools';
import Student from '../student';
/**
 * 班级模型
 */
class Class extends Model<InferAttributes<Class>, InferCreationAttributes<Class>>  {
  // 类型定义 CreationOptional为创建或更新时可以传入的选项
  declare cid: CreationOptional<number>;
  declare cname: string;
  declare updatedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  // 一对多学生后自动给实例添加API
  /**
   *  获取该班级下的所有学生
   */
  declare getStudents: HasManyGetAssociationsMixin<Student>;
  /**
   * 在该班级下创建学生
   */
  declare createStudent: HasManyCreateAssociationMixin<Student>;
  /**
   * 在班级中移除一个学生
   */
  declare removeStudent: HasManyRemoveAssociationMixin<Student, number>;
  /**
   * 在班级中添加一个学生
   */
  declare addStudent: HasManyAddAssociationMixin<Student, number>;
  /**
   * 该班级是否有该学生
   */
  declare hasStudent: HasManyHasAssociationMixin<Student, number>;
  /**
   * 查询班级是否存在
   * @param cid 班级id
   */
  static async checkCidExist(cid: number) {
    const res = await Class.findByPk(cid)
    return res
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
      get() {
        // 不要 this.updatedAt 因为这样会造成无限递归了，因为你在get函数里面读了自己
        return getNowDateString(this.getDataValue('updatedAt'))
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return getNowDateString(this.getDataValue('createdAt'))
      },
    }
  },
  {
    // 将模型链接到？
    sequelize: sequelizeIns,
    // 模型名称
    modelName: 'Class',
    // 强制表名和模型一致
    freezeTableName: true,
    // // 开启软删除
    // paranoid: true,
    // // 开启软删除
    // deletedAt: true
  }
)

export default Class