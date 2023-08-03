// seq实例
import sequelizeIns from '../../config/database';
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'

// 使用原生seq+ts
/**
 * 学生模型 
 * 一个模型实例代表一行元组或实例，模型通常封装了常用的DB操作API让开发者安全的操作数据库
 * 通过面向对象的方式来操作数据库，可以让我们用一套代码操作任何数据库
 */
class Student extends Model<InferAttributes<Student>, InferCreationAttributes<Student>> {
  // 下面这些是对模型中的字段定义，定义他们能够享有更好的ts体验，访问元组时有类型提示
  // CreationOptional，代表可选参数，插入或更新时可以不需要传递的内容;
  declare sid: CreationOptional<number>;
  declare sname: string;
  declare sage: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  // 下面是对模型封装的公共方法
  /**
   * 查询该学生是否存在
   * @param sid 学生id
   * @returns 不存在返回null 存在则返回实例
   */
  static async checkSidExist (sid: number) {
    const res = await Student.findByPk(sid)
    return res
  }
}

// 定义模型字段
Student.init(
  {
    sid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeIns,
    modelName: 'Student',
    freezeTableName: true,
    // 开启软删除
    paranoid: true,
    // 开启软删除
    deletedAt: true
  }
)

// 创建表 (必须要有这个步骤，否则创建模型并保存到数据库时会一直报错)
Student.sync()

// import { PrimaryKey, AutoIncrement, Column, DataType, HasMany, IsEmail, Length, Table, Unique, Model, CreatedAt, UpdatedAt } from 'sequelize-typescript';
// import path from 'path'

// 使用seq-ts
// @Table({ tableName: 'Student' })
// class Student extends Model<Student> {

//   @PrimaryKey
//   @AutoIncrement
//   @Column({
//     type: DataType.INTEGER,
//     comment: '学生id'
//   })
//   // 必须加感叹号，代表有该属性
//   sid!: number;

//   @Column({
//     type: DataType.STRING,
//     comment: '学生姓名',
//   })
//   sname!: string;


//   @Column({
//     type: DataType.INTEGER,
//     comment: '学生年龄'
//   })
//   sage!: number

//   @CreatedAt
//   createdAt!: string;

//   @UpdatedAt
//   updatedAt!: string;

// }

// // 添加模型
// sequelizeIns.addModels([ path.resolve(__dirname, `./index.ts`) ])

export default Student;


