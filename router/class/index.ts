import ClassController from '../../controller/class';
import Router from 'koa-router';
import ClassMiddleWare from '../../middleware/class';

const ClassRouter = new Router()

// 添加班级 中间件检查请求体
ClassRouter.post('/add', ClassMiddleWare.checkClassBodyWithoutId, ClassController.toAddClass)

// 修改班级 中间件检查请求体
ClassRouter.put('/update', ClassMiddleWare.checkClassBody, ClassController.toUpdateClass)

// 删除班级
ClassRouter.delete('/delete', ClassMiddleWare.checkClassCidQuery, ClassController.toDeleteClass)

// 获取班级
ClassRouter.get('/get', ClassMiddleWare.checkClassCidQuery, ClassController.toGetClass)

// 获取班级下的所有学生
ClassRouter.get('/allStudent', ClassMiddleWare.checkClassCidQuery, ClassController.toGetAllStudent)

export default ClassRouter
