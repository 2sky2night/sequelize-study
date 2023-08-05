import Course from "../../model/course"
import Student from "../../model/student";
import StudentCourse from "../../model/student_course";
import { checkStudentAndCourseExist } from "./actions";

/**
 * 课程service层
 */
const CourseService = {
  /**
   * 添加课程
   * @param course_name  课程名
   */
  async addCourse(course_name: string) {
    // 添加课程
    return await Course.create({ course_name })
  },
  /**
   * 获取课程
   * @param course_id 课程id
   * @returns 
   */
  async getCourse(course_id: number) {
    const course = await Course.findByPk(course_id)
    if (course) {
      return Promise.resolve(course)
    } else {
      return Promise.resolve(0)
    }
  },
  /**
   * 学生选择课程
   * @param sid 学生id
   * @param course_id 课程id
   * -2学生、-1课程不存在，0学生以及选择了该课程了 1成功
   */
  async studentChooseCourse(sid: number, course_id: number) {
    // 查询学生和课程是否存在
    const res = await checkStudentAndCourseExist(sid, course_id)

    if (typeof res === 'number') {
      // 不存在
      return Promise.resolve(res)
    }
    // 存在
    const [student, course] = res
    // 查询该学生是否选择了该课程
    const resExist = await student.hasCourse(course)

    if (resExist) {
      // 存在了
      return Promise.resolve(0)
    } else {
      // 不存在 选择该课程

      // 1.使用延迟加载
      // await student.addCourse(course) 这句话是指在学生选择课程表中插入一条学生选择课程的记录

      await student.addCourse(course, {
        // through 代表两个模型之间的关联表
        // 值为一个对象，每个key都是关联表中的字段
        // 这句话的意思是在学生选择课程表(StudentCourse)中插入学生选择课程的记录，并让学生的该门课程成绩为0
        through: {
          score: 100
        }
      })

      // 2.使用模型来添加关联数据
      // StudentCourse.create({
      //   sid,
      //   course_id,
      //   score: 55
      // })

      return Promise.resolve(1)
    }
  },
  /**
   * 更新学生成绩
   */
  async updateCourseGrades(sid: number, course_id: number, score: number) {
    // 查询学生和课程是否存在
    const res = await checkStudentAndCourseExist(sid, course_id)

    if (typeof res === 'number') {
      // 不存在
      return Promise.resolve(res)
    }

    // 存在
    // 1.使用延迟技术
    // const [student, course] = res
    // // 查询该学生是否选择了该课程
    // const resExist = await student.hasCourse(course)
    // if (resExist) {
    //   // 选择了,这种方式为批量更新
    //   await student.setCourses([course], {
    //     through: {
    //       score
    //     }
    //   })

    //   return Promise.resolve(1)
    // } else {
    //   // 未选择课程
    //   return Promise.resolve(0)
    // }
    // 2.使用模型
    // 学生是否选择了课程
    const item = await StudentCourse.findOne({
      where: {
        sid,
        course_id
      }
    })
    if (item) {
      // 选择了
      await item.update({
        score
      })
      return Promise.resolve(1)
    } else {
      // 未选择
      return Promise.resolve(0)

    }

  },
  /**
   * 学生取消修读课程
   * @param sid 学生id
   * @param course_id 课程id
   */
  async removeStudentChooseCourse(sid: number, course_id: number) {
    // 查询学生和课程是否存在
    const res = await checkStudentAndCourseExist(sid, course_id)

    if (typeof res === 'number') {
      // 不存在
      return Promise.resolve(res)
    }
    // 存在 

    // 1.使用延迟技术
    // const [student, course] = res
    // // 查询该学生是否选择了该课程
    // const resExist = await student.hasCourse(course)
    // if (resExist) {
    //   // 选择了,取消修读的课程
    //   student.removeCourse(course)
    // } else {
    //   // 未选择课程
    //   return Promise.resolve(0)
    // }

    // 2.使用模型
    const item = await StudentCourse.findOne({
      where: {
        sid,
        course_id
      }
    })
    if (item) {
      // 选择了 移除
      await item.destroy()
      return Promise.resolve(1)
    } else {
      // 未选择
      return Promise.resolve(0)

    }

  }
}

export default CourseService