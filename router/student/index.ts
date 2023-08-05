import Router from 'koa-router'
import StudentController from '../../controller/student'
import StudentMiddleware from '../../middleware/student'
import PublicMiddleware from '../../middleware'

const StudentRouter = new Router()

// 查
StudentRouter.get('/get', StudentMiddleware.checkStudentSidQuery, StudentController.toGetStudent)
// 增
StudentRouter.post('/add', StudentMiddleware.checkStudentBodyWithoutId, StudentController.toAddStudent)
// 改
StudentRouter.put('/update', StudentMiddleware.checkStudentBody, StudentController.toUpdateStudent)
// 删
StudentRouter.delete('/delete', StudentMiddleware.checkStudentSidQuery, StudentController.toDeleteStudent)
// 加入班级
StudentRouter.post('/joinClass', PublicMiddleware.checkBody, StudentController.toJoinClass)
// 从班级中移除
StudentRouter.delete('/joinClass', StudentController.toRemoveJoinClass)

export default StudentRouter