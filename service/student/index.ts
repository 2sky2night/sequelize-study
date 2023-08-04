// models
import Student from '../../model/student'
import Class from '../../model/class'

export default {
  /**
   * 获取学生
   * @returns 
   */
  async getStudent (sid: number) {
    // 该学生是否存在?
    const res = await Student.checkSidExist(sid)
    if (res === null) {
      return 0
    } else {
      return res
    }
  },
  /**
   * 添加学生
   */
  async addStudent (sname: string, sage: number) {
    // 创建实例并直接保存到数据库中
    const student = await Student.create({ sage, sname })

    return student.toJSON()

  },
  /**
   * 更新学生
   */
  async updateStudent (sid: number, sname: string, sage: number) {
    // 该学生是否存在?
    const res = await Student.checkSidExist(sid)
    if (res === null) {
      return 0
    } else {
      // 存在 更新对应学生记录
      await Student.update(
        // 更新的值
        {
          sage,
          sname
        },
        // sql字句
        {
          where: {
            sid
          }
        }
      )
      // 获取更新后的学生
      const student = await Student.findByPk(sid)
      return student
    }
  },
  /**
   * 删除学生
   * @param sid 
   */
  async deleteStudent (sid: number): Promise<0 | 1> {
    // 学生是否存在?
    const res = await Student.checkSidExist(sid)
    if (res === null) {
      return Promise.resolve(0)
    } else {
      // 存在 删除学生
      await Student.destroy(
        {
          where: {
            sid
          }
        }
      )
      return Promise.resolve(1)
    }
  },
  /**
   * 将学生添加进入班级
   * @param cid 班级id
   * @param sid 学生id
   * @returns -2班级存在 -1学生不存在 0学生已经进入班级了 1添加成功
   */
  async joinClass (cid: number, sid: number) {
    // 查询该班级是否存在
    const classItem = await Class.findByPk(cid)
    // 班级不存在
    if (classItem === null) return Promise.resolve(-2)
    // 存在 查询该学生是否存在
    const student = await Student.findByPk(sid)
    // 学生不存在
    if (student === null) return Promise.resolve(-1)
    // 学生存在 查询是否已经加入班级了?
    if (student.cid === null) {
      // 未加入班级
      student.set('cid', cid)
      await student.save()
      return Promise.resolve(1)
    } else {
      // 加入班级了
      return Promise.resolve(0)
    }
  }
}


