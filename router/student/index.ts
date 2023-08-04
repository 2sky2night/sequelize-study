import Router from 'koa-router'
import StudentController from '../../controller/student'
import StudentMiddleware from '../../middleware/student'

const StudentRouter = new Router()

// 查
StudentRouter.get('/get', StudentMiddleware.checkStudentSidQuery, StudentController.toGetStudent)
// 增
StudentRouter.post('/add', StudentMiddleware.checkStudentBodyWithoutId, StudentController.toAddStudent)
// 改
StudentRouter.put('/update', StudentMiddleware.checkStudentBody, StudentController.toUpdateStudent)
// 删
StudentRouter.delete('/delete', StudentMiddleware.checkStudentSidQuery, StudentController.toDeleteStudent)

export default StudentRouter