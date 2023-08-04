import Class from '../../model/class';

export default {
  /**
   * 创建班级
   * @param cname 班级名称
   */
  async addClass (cname: string) {
    const res = await Class.create({ cname })
    return res
  },
  /**
   * 修改班级
   * @param cid 班级id
   * @param cname 班级名称
   * @returns 0班级不存在
   */
  async updateClass (cid: number, cname: string) {
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
  async deleteClass (cid: number) {
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
  async getClass (cid: number) {
    const classItem = await Class.getClassBase(cid)
    if (classItem) {
      // 存在 
      return Promise.resolve(classItem)
    } else {
      // 不存在
      return Promise.resolve(0)
    }
  }
}