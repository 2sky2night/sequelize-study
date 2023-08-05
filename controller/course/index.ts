import type { Context } from "koa";
import CourseService from "../../service/course";
import response from "../../utils/response";

/**
 * 课程控制层
 */
const CourseController = {
  /**
   * 添加课程
   * @param ctx 
   */
  async toAddCourse(ctx: Context) {
    const { course_name } = ctx.request.body
    const res = await CourseService.addCourse(course_name)
    ctx.body = response(res, 'ok')
  },
  /**
   * 获取课程
   * @param ctx 
   */
  async toGetCourse(ctx: Context) {
    const { course_id } = ctx.request.query
    const res = await CourseService.getCourse(+(course_id as string))
    if (res) {
      ctx.body = response(res, 'ok')
    } else {
      ctx.body = response(null, '课程不存在!', 400)
    }
  },
  /**
   * 学生修读课程
   * @param ctx 
   */
  async toStudentChooseCourse(ctx: Context) {
    const body = ctx.request.body
    if (body === undefined) {
      return ctx.body = response(null, '未携带请求体!', 400)
    }
    if (body.course_id === undefined || body.sid === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    const { course_id, sid } = body
    if (isNaN(course_id) || isNaN(sid)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    const res = await CourseService.studentChooseCourse(sid, course_id)
    if (res === -2) {
      ctx.body = response(null, '学生不存在!', 400)
    } else if (res === -1) {
      ctx.body = response(null, '班级不存在!', 400)
    } else if (res === 0) {
      ctx.body = response(null, '已经选择了该课程', 400)
    } else {
      ctx.body = response(null, '选择课程成功!')
    }
  },
  /**
   * 修改学生成绩
   * @param ctx 
   */
  async toUpdateCourseGrades(ctx: Context) {
    const body = ctx.request.body
    if (body === undefined) {
      return ctx.body = response(null, '未携带请求体!', 400)
    }
    if (body.course_id === undefined || body.sid === undefined || body.score === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    const { course_id, sid, score } = body
    if (isNaN(course_id) || isNaN(sid) || isNaN(score)) {
      return ctx.body = response(null, '参数非法!', 400)
    }
    const res = await CourseService.updateCourseGrades(sid, course_id, score)
    if (res === -2) {
      ctx.body = response(null, '学生不存在!', 400)
    } else if (res === -1) {
      ctx.body = response(null, '班级不存在!', 400)
    } else if (res === 0) {
      ctx.body = response(null, '未选择该课程', 400)
    } else {
      ctx.body = response(null, '修改课程成绩成功!')
    }
  },
  /**
   * 学生取消修读课程
   * @param ctx 
   */
  async toRemoveStudentChooseCourse(ctx: Context) {
    const query = ctx.query

    if (query.sid === undefined || query.course_id === undefined) {
      return ctx.body = response(null, '未携带参数!', 400)
    }
    const { sid, course_id } = query
    if (isNaN(+sid) || isNaN(+course_id)) {
      return ctx.body = response(null, '参数非法!', 400)
    }

    const res = await CourseService.removeStudentChooseCourse(+sid, +course_id)
    if (res === -2) {
      ctx.body = response(null, '学生不存在!', 400)
    } else if (res === -1) {
      ctx.body = response(null, '班级不存在!', 400)
    } else if (res === 0) {
      ctx.body = response(null, '未选择该课程', 400)
    } else {
      ctx.body = response(null, '取消选课成功!')
    }

  }
}

export default CourseController