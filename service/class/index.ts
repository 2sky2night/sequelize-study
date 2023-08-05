import Class from '../../model/class';
import Student from '../../model/student';

export default {
  /**
   * 创建班级
   * @param cname 班级名称
   */
  async addClass(cname: string) {
    const res = await Class.create({ cname })
    return res
  },
  /**
   * 修改班级
   * @param cid 班级id
   * @param cname 班级名称
   * @returns 0班级不存在
   */
  async updateClass(cid: number, cname: string) {
    const classItem = await Class.checkCidExist(cid)
    if (classItem) {
      // 存在
      classItem.set('cname', cname)
      // 修改后保存到数据库
      await classItem.save()
      return Promise.resolve(classItem)
    } else {
      // 不存在
      return Promise.resolve(0)
    }
  },
  /**
   * 删除班级
   * @param cid 
   */
  async deleteClass(cid: number) {
    const classItem = await Class.checkCidExist(cid)
    if (classItem) {
      // 存在 删除班级
      await classItem.destroy()
      return Promise.resolve(1)
    } else {
      // 不存在
      return Promise.resolve(0)
    }
  },
  /**
   * 获取班级
   * @param cid 班级id 
   * @returns 
   */
  async getClass(cid: number) {
    const classItem = await Class.checkCidExist(cid)
    if (classItem) {
      // 存在 
      return Promise.resolve(classItem)
    } else {
      // 不存在
      return Promise.resolve(0)
    }
  },
  /**
   * 获取班级里的所有学生
   * @param cid 班级id
   */
  async getAllStudents(cid: number) {
    // 预先加载技术
    const classItem = await Class.findOne({
      where: {
        cid
      },
      // 关联查询 开启后可以查看该班级下的所有学生信息
      include: {
        model: Student,
        // as:'Stus' 若在关联时设置了别名需要指定别名
      }
    })
    // 班级不存在
    if (classItem === null) return Promise.resolve(0)
    // 存在
    // 班级存在直接在该班级中插入一个学生
    // await classItem.createStudent({ sname: '张三', sage: 123 })
    // console.log(await classItem.getStudents())
    return classItem
 
    // 延迟加载技术
    // const classItem = await Class.findByPk(cid)
    // if (classItem === null) return Promise.resolve(0)
    // // @ts-ignore
    // return Promise.resolve(await classItem.getStudents())
    // 只要设置了一对多关系后，父实例可以拥有管理子模型的API 被引用的表实例模型自动拥有该函数
    // console.log(classItem.__proto__); 打印父实例的原型即可查看所有管理的API


    // 调用可以获取父实例拥有的所有子实例（翻译成人话就是获取班级的所有学生）
    // @ts-ignore 
    // const students = await classItem.getStudents();
    // 打印子实例操作父实例的API
    // console.dir(students[0].__proto__)
    // console.log(await students[0].getClass())

  }
}