import Class from "../../model/class"
import Student from "../../model/student"

/**
 * 查询学生和班级是否存在
 * @param sid 学生id
 * @param cid 班级id
 * @returns 
 */
export const checkStudentAndClassExist = async (sid: number, cid: number) => {
  // 查询该班级是否存在
  const classItem = await Class.findByPk(cid)
  // 班级不存在
  if (classItem === null) return Promise.resolve(-2)
  // 存在 查询该学生是否存在
  const student = await Student.findByPk(sid)
  // 学生不存在
  if (student === null) return Promise.resolve(-1)
  // 学生和班级都存在
  return Promise.resolve([student, classItem] as [Student, Class])
}