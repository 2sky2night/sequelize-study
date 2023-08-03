import Router from 'koa-router'
import StudentController from '../../controller/student'

const StudentRouter = new Router()

// 查
StudentRouter.get('/get', StudentController.toGetStudent)
// 增
StudentRouter.post('/add', StudentController.toAddStudent)
// 改
StudentRouter.put('/update', StudentController.toUpdateStudent)
// 删
StudentRouter.delete('/delete', StudentController.toDeleteStudent)

export default StudentRouter