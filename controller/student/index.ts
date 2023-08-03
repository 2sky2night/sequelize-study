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
    const res = await StudentService.getStudent(+(ctx.query.sid as string))
    if (typeof res === 'string') {
      ctx.body = response(null, res, 400)
    } else {
      ctx.body = response(res, 'ok')
    }
  },
  /**
   * 添加学生
   * @param ctx 
   */
  async toAddStudent (ctx: Context) {
    if (ctx.request.body.sname === undefined || ctx.request.body.sage === undefined) {
      ctx.body = response(null, '参数错误', 400)
    }
    const res = await StudentService.addStudent(ctx.request.body.sname, ctx.request.body.sage)
    ctx.body = response(res, '增加成功')
  },
  /**
   * 更新学生信息
   * @param ctx 
   */
  async toUpdateStudent (ctx: Context) {
    if (ctx.request.body.sname === undefined || ctx.request.body.sage === undefined || ctx.request.body.sid === undefined) {
      ctx.body = response(null, '参数错误', 400)
    }
    const res = await StudentService.updateStudent(ctx.request.body.sid, ctx.request.body.sname, ctx.request.body.sage)
    if (typeof res === 'string') {
      ctx.body = response(null, res, 400)
    } else {
      ctx.body = response(res, '修改成功')
    }
  },
  /**
   * 删除学生
   * @param ctx 
   * @returns 
   */
  async toDeleteStudent (ctx: Context) {
    // 解析参数
    if (ctx.query.sid === undefined) {
      ctx.body = response(null, '未携带参数!', 400)
      return
    }
    const sid = +ctx.query.sid
    if (isNaN(sid)) {
      ctx.body = response(null, '参数非法!', 400)
      return
    }

    const res = await StudentService.deleteStudent(sid)

    if (res) {
      ctx.body = response(res, '删除成功!')
    } else {
      ctx.body = response(null, '删除失败!', 400)
    }



  }
}