import Course from "../../model/course"
import Student from "../../model/student"

/**
 * 查询学生和班级是否存在
 * @returns -2学生不存在 -1 学生不存在 若返回数组则都存在
 */
export const checkStudentAndCourseExist = async (sid: number, course_id: number): Promise<-2 | -1 | [Student, Course]> => {
  // 查询学生是否存在
  const student = await Student.findByPk(sid)
  if (student === null) {
    return Promise.resolve(-2)
  }
  // 查询课程是否存在
  const course = await Course.findByPk(course_id)
  if (course === null) {
    return Promise.resolve(-1)
  }
  return Promise.resolve([
    student, course
  ] as [Student, Course])
}