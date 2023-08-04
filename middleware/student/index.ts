import type { Context, Next } from 'koa';
import response from '../../utils/response';

/**
 * 学生控制层中间件
 */
const StudentMiddleware = {
  /**
   * 校验查询参数中的学生id--sid
   */
  async checkStudentSidQuery (ctx: Context, next: Next) {
    if (ctx.query.sid === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    const sid = +ctx.query.sid
    if (isNaN(sid)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    await next()
  },
  /**
   * 检验学生请求体 不包括id
   * @param ctx 
   * @param next 
   */
  async checkStudentBodyWithoutId (ctx: Context, next: Next) {
    if (ctx.request.body === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    if (ctx.request.body.sname === undefined || ctx.request.body.sage === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    await next()
  },
  /**
   * 校验学生请求体
   * @param ctx 
   * @param next 
   * @returns 
   */
  async checkStudentBody (ctx: Context, next: Next) {
    if (ctx.request.body === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    if (ctx.request.body.sname === undefined || ctx.request.body.sage === undefined || ctx.request.body.sid === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    const sid = +ctx.request.body.sid
    if (isNaN(sid)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    await next()
  }
}

export default StudentMiddleware