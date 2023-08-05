import Router from 'koa-router'
import StudentRouter from './student'
import ClassRouter from './class'
import CourseRouter from './course'

const RootRouter = new Router()

// 注册学生模块路由
RootRouter.use('/student', StudentRouter.routes())
// 注册班级模块路由
RootRouter.use('/class', ClassRouter.routes())
// 注册课程模块路由
RootRouter.use('/course', CourseRouter.routes())

export default RootRouter