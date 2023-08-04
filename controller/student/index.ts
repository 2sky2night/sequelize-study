// types
import type { Context } from 'koa'
// service
import StudentService from '../../service/student'
// utils
import response from '../../utils/response'

export default {
  /**
   * 通过查询参数获取学生
   * @param ctx 
   */
  async toGetStudent (ctx: Context) {
    // 解析参数
    const sid = +(ctx.query.sid as string)
    const res = await StudentService.getStudent(sid)
    if (res) {
      ctx.body = response(res, 'ok')
    } else {
      ctx.body = response(null, '学生不存在!')
    }
  },
  /**
   * 添加学生
   * @param ctx 
   */
  async toAddStudent (ctx: Context) {
    // 解析参数
    const { sname, sage } = ctx.request.body
    const res = await StudentService.addStudent(sname, sage)
    ctx.body = response(res, '增加成功!')
  },
  /**
   * 更新学生信息
   * @param ctx 
   */
  async toUpdateStudent (ctx: Context) {
    // 解析参数
    const { sid, sname, sage } = ctx.request.body
    const res = await StudentService.updateStudent(sid, sname, sage)
    if (res) {
      ctx.body = response(res, '修改成功!')
    } else {
      ctx.body = response(null, '学生不存在!', 400)
    }

  },
  /**
   * 删除学生
   * @param ctx 
   * @returns 
   */
  async toDeleteStudent (ctx: Context) {
    // 解析参数
    const sid = +(ctx.query.sid as string)

    const res = await StudentService.deleteStudent(sid)

    if (res) {
      ctx.body = response(res, '删除成功!')
    } else {
      ctx.body = response(null, '学生不存在!', 400)
    }

  }
}