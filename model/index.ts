// 此文件用来按照外键约束的顺序来创建表
import Class from './class';
import Student from './student';

// 创建表 以及创建各种表约束的地方
(async function () {

  // 注意:一定是先建立联系 后创建表!!!!!

  // 建立联系
  StudentAndClassRelation()

  // 创建表
  await Class.sync()
  await Student.sync()

})()

/**
 * 班级和学生实体的关系 一对多
 */
function StudentAndClassRelation () {

  // 创建一个 一对一 关系, hasOne 和 belongsTo 关联一起使用;
  // 创建一个 一对多 关系, hasMany he belongsTo 关联一起使用;
  // 创建一个 多对多 关系, 两个 belongsToMany 调用一起使用.
  // 为啥需要成对使用？例如 A.hasMany(B)，A知道了自己关联了B，但是B不知道关联了A
  // 会造成A实例可以拥有管理B实例的API，但B实例没有响应的API进行操作A
  // 因此,为了充分发挥 Sequelize 的作用,我们通常成对设置关系,以便两个模型都 互相知晓.

  // 一个班级有多个学生 （该操作会向学生表添加外键字段）
  // 同时该操作也会让每个实例拥有一个API，可以查询该班级下的所有学生
  // 默认为 get[ModelName]s，也就是get+模型名+s,
  // 该实例下为getStudents
  Class.hasMany(Student, {
    // 设置别名
    // as:'Stus',
    // 创建的外键
    foreignKey: 'cid',
    // 参照的外键（被引用的字段,必须是主键） 默认为被引用表的外键
    sourceKey: 'cid',
    // 被引用的字段实例被删除时，将外键设置为null 若为CASCADE时，班级被删除，对应该班级所以学生都被删除
    onDelete: 'SET NULL',
    // 被引用的字段实例更新时，同时更新引用字段
    onUpdate: 'CASCADE'
  })

  // 多个学生属于一个班级 （该操作会向学生表添加外键字段）
  Student.belongsTo(Class, {
    // 创建的外键
    foreignKey: 'cid',
    // 参照的外键（被引用的字段,必须是主键）默认为被引用表的外键
    targetKey: 'cid',
    constraints:false
  })

}