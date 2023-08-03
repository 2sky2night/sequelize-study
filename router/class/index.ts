import ClassController from '../../controller/class';
import Router from 'koa-router';

const ClassRouter = new Router()

// 添加班级
ClassRouter.post('/add',ClassController.toAddClass)

export default ClassRouter
