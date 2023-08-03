import Class from '../../model/class';

export default {
  /**
   * 创建班级
   * @param cname 
   */
  async toAddClass (cname: string) {
    const res = await Class.create({ cname })
    return res
  }
}