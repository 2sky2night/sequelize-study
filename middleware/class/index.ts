import type { Context, Next } from 'koa';
import response from '../../utils/response';

/**
 * 班级控制层中间件
 */
const ClassMiddleWare = {

  /**
   * 检查班级信息请求体的中间件--不检查id
   * @param ctx body:{cname:string}
   * @returns 
   */
  async checkClassBodyWithoutId (ctx: Context, next: Next) {
    if (ctx.request.body === undefined) {
      return ctx.body = response(null, '未携带请求体!', 400)
    }
    if (ctx.request.body.cname === undefined) {
      return ctx.body = response(null, '有参数未携带!', 400)
    }
    // 检验通过放行执行剩余中间件
    await next()
  },

  /**
   * 检查query参数中的班级id的中间件 
   * @param ctx -- query:{cid:number}
   */
  async checkClassCidQuery (ctx: Context, next: Next) {
    if (ctx.query.cid === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    const cid = +ctx.query.cid
    if (isNaN(cid)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    // 校验通过放行剩余中间件
    await next()
  },
  /**
   * 检查班级请求体的中间件
   * @param ctx -- body:{cid:number;cname:string}
   * @param next 
   * @returns 
   */
  async checkClassBody (ctx: Context, next: Next) {
    if (ctx.request.body === undefined) {
      return ctx.body = response(null, '未携带请求体!', 400)
    }
    if (ctx.request.body.cname === undefined || ctx.request.body.cid === undefined) {
      return ctx.body = response(null, '有参数未携带!', 400)
    }
    const cid = +ctx.request.body.cid
    if (isNaN(cid)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    // 检验通过放行执行剩余中间件
    await next()
  },
}

export default ClassMiddleWare