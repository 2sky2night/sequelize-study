import Router from 'koa-router'
import StudentRouter from './student'
import ClassRouter from './class'

const RootRouter = new Router()

// 注册学生模块路由
RootRouter.use('/student', StudentRouter.routes())
// 注册班级模块路由
RootRouter.use('/class', ClassRouter.routes())

export default RootRouter