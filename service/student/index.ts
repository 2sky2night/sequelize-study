// models
import Student from '../../model/student'

export default {
  /**
   * 获取学生
   * @returns 
   */
  async getStudent (sid: number) {
    // 该学生是否存在?
    const res = await Student.checkSidExist(sid)
    if (res === null) {
      return '学生不存在'
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
    // // 查询该学生名是否存在了?
    // const res = await Student.findAll({
    //   where: {
    //     sname
    //   }
    // })

    // if (res.length) {
    //   // 存在
    //   return '学生名重复'
    // } else {
    //   // 不存在
    //   const student = await Student.create({ sage, sname })

    //   return student.toJSON()
    // }

    // 创建学生模型并插入到数据库中
  },
  /**
   * 更新学生
   */
  async updateStudent (sid: number, sname: string, sage: number) {
    // 该学生是否存在?
    const res = await Student.checkSidExist(sid)
    if (res === null) {
      return '学生不存在'
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
  }
}


