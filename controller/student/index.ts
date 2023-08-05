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
  async toGetStudent(ctx: Context) {
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
  async toAddStudent(ctx: Context) {
    // 解析参数
    const { sname, sage } = ctx.request.body
    const res = await StudentService.addStudent(sname, sage)
    ctx.body = response(res, '增加成功!')
  },
  /**
   * 更新学生信息
   * @param ctx 
   */
  async toUpdateStudent(ctx: Context) {
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
  async toDeleteStudent(ctx: Context) {
    // 解析参数
    const sid = +(ctx.query.sid as string)

    const res = await StudentService.deleteStudent(sid)

    if (res) {
      ctx.body = response(res, '删除成功!')
    } else {
      ctx.body = response(null, '学生不存在!', 400)
    }

  },
  /**
   * 加入班级
   * @param ctx 
   */
  async toJoinClass(ctx: Context) {
    const { sid, cid } = ctx.request.body
    if (sid === undefined || cid === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    if (isNaN(+sid) || isNaN(+cid)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    const res = await StudentService.joinClass(+cid, +sid)
    if (res === -2) {
      ctx.body = response(null, '班级不存在!', 400)
    } else if (res === -1) {
      ctx.body = response(null, '学生不存在!', 400)
    } else if (res === 0) {
      ctx.body = response(null, '学生已进入班级!', 400)
    } else {
      ctx.body = response(null, '进入班级成功!', 400)
    }
  },
  /**
   * 将学生移除班级
   * @param ctx 
   */
  async toRemoveJoinClass(ctx: Context) {
    const { sid, cid } = ctx.query
    if (sid === undefined || cid === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    if (isNaN(+sid) || isNaN(+cid)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    const res = await StudentService.removeJoinClass(+cid, +sid)
    if (res === -2) {
      ctx.body = response(null, '班级不存在!', 400)
    } else if (res === -1) {
      ctx.body = response(null, '学生不存在!', 400)
    } else if (res === 0) {
      ctx.body = response(null, '学生还未加入班级!', 400)
    } else {
      ctx.body = response(null, '将学生移除班级成功!', 400)
    }
  }
}