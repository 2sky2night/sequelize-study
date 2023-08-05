import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyRemoveAssociationMixin, DataTypes, Model } from "sequelize";
import sequelizeIns from "../../config/database";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import Student from "../student";

/**
 * 课程模型
 */
class Course extends Model<InferAttributes<Course>, InferCreationAttributes<Course>>  {
  declare course_id: CreationOptional<number>;
  declare course_name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  /**
   * 该课程是否有这个学生选择了
   */
  declare hasStudent: BelongsToManyHasAssociationMixin<Student, number>;
  /**
   * 获取该课程下的学生
   */
  declare getStudents: BelongsToManyGetAssociationsMixin<Student>;
  /**
   * 给课程添加一个学生
   */
  declare addStudent: BelongsToManyAddAssociationMixin<Student, number>;
  /**
   * 在该课程下移除一个学生
   */
  declare removeStudent: BelongsToManyRemoveAssociationMixin<Student, number>
}

Course.init(
  {
    course_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    course_name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize: sequelizeIns,
    freezeTableName: true,
    modelName: 'Course'
  }
)

export default Course