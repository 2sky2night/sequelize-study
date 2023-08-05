import Router from "koa-router";
import CourseMiddleware from "../../middleware/course";
import CourseController from "../../controller/course";

const CourseRouter = new Router()

// 获取课程信息
CourseRouter.get('/get', CourseMiddleware.checkCourseIdQuery, CourseController.toGetCourse)

// 添加课程
CourseRouter.post('/add', CourseMiddleware.checkCourseBodyWithoutId, CourseController.toAddCourse)

// 修读课程
CourseRouter.post('/choose', CourseController.toStudentChooseCourse)

// 修改课程成绩
CourseRouter.post('/update/grades', CourseController.toUpdateCourseGrades)

// 取消选课
CourseRouter.delete('/choose', CourseController.toRemoveStudentChooseCourse)

export default CourseRouter