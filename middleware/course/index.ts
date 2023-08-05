import type { Context,Next } from "koa"
import response from "../../utils/response"

/**
 * 课程中间件
 */
const CourseMiddleware = {
  /**
   * 检查请求体 body:{course_name:string}
   */
  async checkCourseBodyWithoutId(ctx: Context, next: Next) {
    const body = ctx.request.body
    if (body === undefined) {
      return ctx.body=response(null,'未携请求体!',400)
    }
    if (body.course_name === undefined) {
      return ctx.body = response(null, '未携参数!', 400)
    }
    await next()
  },
  /**
   * 检查查询参数中course_id 
   */
  async checkCourseIdQuery(ctx: Context, next: Next) {
    if (ctx.query.course_id === undefined) {
      return ctx.body = response(null, '未携参数!', 400)
    }
    const course_id = +ctx.query.course_id
    if (isNaN(course_id)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    await next()
  }

}


export default CourseMiddleware