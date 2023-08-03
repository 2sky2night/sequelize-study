import ClassService from '../../service/class/index'
import type { Context } from 'koa'
import response from '../../utils/response'

const ClassController = {
  /**
   * 添加班级
   * @param ctx
   * @returns 
   */
  async toAddClass (ctx: Context) {
    if (ctx.request.body === undefined) {
      return ctx.body = response(null, '未携带请求体!', 400)
    }
    if (ctx.request.body.cname === undefined) {
      return ctx.body = response(null, '有参数未携带!', 400)
    }
    const res = await ClassService.toAddClass(ctx.request.body.cname)
    ctx.body = response(res, 'ok')
  }
}


export default ClassController