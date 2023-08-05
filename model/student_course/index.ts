import { DataTypes, Model } from 'sequelize'
import sequelizeIns from '../../config/database';
import type { CreationOptional } from 'sequelize';

/**
 * 学生选课模型
 */
class StudentCourse extends Model {
  /**
   * 选课成绩
   */
  declare score: CreationOptional<number | null>;
  /**
   * 课程id
   */
  declare course_id: number;
  /**
   * 选课学生id
  */
  declare sid: number;
}


StudentCourse.init(
  {
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize: sequelizeIns,
    modelName: 'StudentCourse',
    tableName: 'student_course',
    freezeTableName: true,
  }
)

export default StudentCourse