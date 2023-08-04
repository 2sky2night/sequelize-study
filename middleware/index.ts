import type { Context, Next } from 'koa'
import response from '../utils/response'
/**
 * 公共中间件
 */
const PublicMiddleware = {
  /**
   * 检查请求体是否携带
   */
  async checkBody (ctx: Context, next: Next) {
    if (ctx.request.body === undefined) {
      return ctx.body = response(null, '未携带请求体!', 400)
    }
    await next()
  }
}

export default PublicMiddleware