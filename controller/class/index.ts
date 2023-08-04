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
    const res = await ClassService.addClass(ctx.request.body.cname)
    ctx.body = response(res, '增加成功!')
  },
  /**
   * 修改班级
   * @param ctx 
   */
  async toUpdateClass (ctx: Context) {
    const { cname, cid } = ctx.request.body
    const res = await ClassService.updateClass(cid, cname)
    if (res) {
      ctx.body = response(res, '更新成功!')
    } else {
      ctx.body = response(null, '班级不存在!', 400)
    }
  },
  /**
   * 删除班级
   * @param ctx 
   */
  async toDeleteClass (ctx: Context) {
    const cid = +(ctx.query.cid as string)
    const res = await ClassService.deleteClass(cid)
    if (res) {
      ctx.body = response(res, '删除成功!')
    } else {
      ctx.body = response(null, '班级不存在!', 400)
    }
  },
  /**
   * 获取班级
   * @param ctx 
   */
  async toGetClass (ctx: Context) {
    const cid = +(ctx.query.cid as string)
    const res = await ClassService.getClass(cid)
    if (res) {
      ctx.body = response(res, 'ok')
    } else {
      ctx.body = response(null, '班级不存在!', 400)
    }
  },
  /**
   * 获取班级的所有学生
   * @param ctx 
   */
  async toGetAllStudent (ctx: Context) {
    const cid = +(ctx.query.cid as string)
    const res = await ClassService.getAllStudents(cid)
    if (res) {
      ctx.body = response(res, 'ok')
    } else {
      ctx.body = response(null, '班级不存在!', 400)
    }
  }
}


export default ClassController