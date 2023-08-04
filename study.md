### 1.使用须知
  看文档操作
  https://www.sequelize.cn/other-topics/constraints-and-circularities 官方文档
  https://demopark.github.io/sequelize-docs-Zh-CN/core-concepts/assocs.html 这个最好
  https://blog.csdn.net/qq_30960005/article/details/105324795 配套案例
  https://www.bookstack.cn/read/sequelize-5.x-zh/spilt.3.associations.md 
  https://clwy.cn/guide/pages/sequelize-v5-associations

### 2.sequlize连接数据库
  要使用sequlize连接mysql数据库,需要提前下载mysql2驱动器让sequlize连接mysql数据库

  下例为使用sequlize连接mysql数据库的代码:
```ts
import { Sequelize } from 'sequelize'

// 创建seq实例链接数据库
const sequelizeIns = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'student-system',
  // 配置时区 比国际时间多8小时,只要涉及时间相关的数据都会 +8个小时
  timezone:'+08:00'
});
// 测试连接
(async function () {
  try {
    await sequelizeIns.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelizeIns
```

### 3.案例的关系
实体:学生(sid,sname,sage)、班级(cid,cname)、课程(rid,rname)
班级--拥有--学生(1--n)
学生--选课--课程(n-n)
学生--成绩--课程(n-n)

有以下模型:
1.学生(sid,sname,sage,cid)
2.班级(cid,cname)
3.课程(rid,rname)
4.选课(sid,rid)
5.成绩(sid,rid,score)

### 4.模型
  模型即是ORM的精髓，将数据元组映射成对象就靠的模型。使用sequlize就可以帮我们快速建立映射，并创建表。sequlize既可以使用模型创建表，也可以映射到现有表中。下面来快速的创建模型吧~
#### 1.班级模型
```ts
import sequelizeIns from '../../config/database';
import { DataTypes, Model, InferCreationAttributes, InferAttributes, CreationOptional } from 'sequelize';
import { getNowDateString } from '../../utils/tools';
/**
 * 班级模型
 */
class Class extends Model<InferAttributes<Class>, InferCreationAttributes<Class>>  {
  // 类型定义 CreationOptional为创建或更新时可以传入的选项
  declare cid: CreationOptional<number>;
  declare cname: string;
  declare deletedAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  /**
   * 查询班级是否存在
   * @param cid 班级id
   */
  static async checkCidExist (cid: number) {
    const res = await Class.findByPk(cid)
    return res
  }
  /**
   * 查询班级是否存在  返回字段返回字段不包含(deletedAt)
   * @param cid 班级id
   * @returns 
   */
  static async getClassBase (cid: number) {
    const classItem = await Class.findOne({
      attributes: {
        exclude: [ 'deletedAt' ]
      },
      where: {
        cid
      }
    })
    return classItem ? classItem : null
  }
}

Class.init(
  {
    cid: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    cname: DataTypes.STRING,
    updatedAt: {
      type: DataTypes.DATE,
      get () {
        // 不要 this.updatedAt 因为这样会造成无限递归了，因为你在get函数里面读了自己
        return getNowDateString(this.getDataValue('updatedAt'))
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return getNowDateString(this.getDataValue('createdAt'))
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      get () {
        const temp = this.getDataValue('deletedAt')
        return temp === null ? null : getNowDateString(this.getDataValue('deletedAt'))
      },
    },
  },
  {
    // 将模型链接到？
    sequelize: sequelizeIns,
    // 模型名称
    modelName: 'Class',
    // 强制表名和模型一致
    freezeTableName: true,
    // // 开启软删除
    // paranoid: true,
    // // 开启软删除
    // deletedAt: true
  }
)

export default Class

```

#### 2.学生模型
```ts
// seq实例
import sequelizeIns from '../../config/database';
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { getNowDateString } from '../../utils/tools';
import Class from '../class';

// 使用原生seq+ts
/**
 * 学生模型 
 * 一个模型实例代表一行元组或实例，模型通常封装了常用的DB操作API让开发者安全的操作数据库
 * 通过面向对象的方式来操作数据库，可以让我们用一套代码操作任何数据库
 */
class Student extends Model<InferAttributes<Student>, InferCreationAttributes<Student>> {
  // 下面这些是对模型中的字段定义，定义他们能够享有更好的ts体验，访问元组时有类型提示
  // CreationOptional，代表可选参数，插入或更新时可以不需要传递的内容;
  declare sid: CreationOptional<number>;
  declare sname: string;
  declare sage: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  // 下面是对模型封装的公共方法
  /**
   * 查询该学生是否存在
   * @param sid 学生id
   * @returns 不存在返回null 存在则返回实例
   */
  static async checkSidExist (sid: number) {
    const res = await Student.findByPk(sid)
    return res
  }
  /**
   * 获取学生数据(不包含deletedAt字段)
   * @param sid 学生id
   * @returns 学生实例或null（未找到）
   */
  static async getStudentBase (sid: number) {
    const student = await Student.findOne({
      attributes: {
        exclude: [ 'deletedAt' ]
      },
      where: {
        sid
      }
    })

    if (student === null) {
      return null
    } else {
      return student
    }
  }
}

// 定义模型字段
Student.init(
  {
    sid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      // get是格式化该字段 也就是当读取该字段时会被格式化
      get () {
        // 不要 this.updatedAt 因为这样会造成无限递归了，因为你在get函数里面读了自己
        return getNowDateString(this.getDataValue('updatedAt'))
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return getNowDateString(this.getDataValue('createdAt'))
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      get () {
        const temp = this.getDataValue('deletedAt')
        return temp === null ? null : getNowDateString(this.getDataValue('deletedAt'))
      },
    }
  },
  {
    sequelize: sequelizeIns,
    modelName: 'Student',
    freezeTableName: true,
    // // 开启软删除
    // paranoid: true,
    // // 开启软删除
    // deletedAt: true
  }
)

export default Student;

```

### 5.模型关联
  数据库实体和实体之间是有关系的，对于有关系的表，也可以使用sequlize来定义关系，然后再创建表，模型间建立关系后，可以使用sequlize封装的API快速管理两个实体间的数据。

这篇文档有详情的介绍模型关联的使用方式

[Associations - 关联 | sequelize-docs-Zh-CN (demopark.github.io)](https://demopark.github.io/sequelize-docs-Zh-CN/core-concepts/assocs.html)

省流：

- 创建一个 **一对一** 关系, `hasOne` 和 `belongsTo` 关联一起使用;
- 创建一个 **一对多** 关系, `hasMany` he `belongsTo` 关联一起使用;
- 创建一个 **多对多** 关系, 两个 `belongsToMany` 调用一起使用.
- 为啥需要成对使用？例如A和B实体是一对多的关系，所以使用 A.hasMany(B)，A知道了自己关联了B，但是B不知道关联了A会造成A实例可以拥有管理B实例的API，但B实例没相应的API进行操作A
- 因此,为了充分发挥 Sequelize 的作用,我们通常成对设置关系,以便两个模型都 互相知晓，不然只能通过原始的查询器进行操作了。

  #### 5.1 1对n
#####   **模型与模型之间的关联创建:**

  ```ts
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
  ```

#####   **一对n关系创建时注意事项**

###### 	**父表管理子表HasMany**

​	创建好一对多的关联后，Class就可以管理Student了，HasMany调用后，会给Class原型上添加管理Student的API。对于这些API的命名方式猜测为 默认为 `get[ModelName]s，也就是get+模型名+s`，其中ModelName为子模型，例如是Student为模型名称，则API名称为getStudents

​	如图：

  <img src="data:image/png;base64,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">

​	这些API可以让我们管理班级上的学生，在我们获取班级实例后，可以直接在该班级上增删改查学生，调用时的具体参数查看官网[HasMany | Sequelize](https://sequelize.org/api/v6/class/src/associations/has-many.js~hasmany)，也可以看下图简略表格，表格中的函数名称是省略了对应别名的。例如addStudent变成了add

| Public Methods |                                                              |      |
| -------------- | ------------------------------------------------------------ | ---- |
| public         | async [add](https://sequelize.org/api/v6/class/src/associations/has-many.js~HasMany.html#instance-method-add)(sourceInstance: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html), targetInstances: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html) \| [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html)[] \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[] \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)[] \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), options: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)Associate one or more target rows with `this`. |      |
| public         | async [count](https://sequelize.org/api/v6/class/src/associations/has-many.js~HasMany.html#instance-method-count)(instance: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html), options: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>Count everything currently associated with this, using an optional where clause. |      |
| public         | async [create](https://sequelize.org/api/v6/class/src/associations/has-many.js~HasMany.html#instance-method-create)(sourceInstance: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html), values: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), options: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)Create a new instance of the associated model and associate it with this. |      |
| public         | async [get](https://sequelize.org/api/v6/class/src/associations/has-many.js~HasMany.html#instance-method-get)(instances: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Model](https://sequelize.org/api/v6/class/src/model.js~Model.html)>, options: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Model](https://sequelize.org/api/v6/class/src/model.js~Model.html)>>Get everything currently associated with this, using an optional where clause. |      |
| public         | async [has](https://sequelize.org/api/v6/class/src/associations/has-many.js~HasMany.html#instance-method-has)(sourceInstance: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html), targetInstances: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html) \| [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html)[] \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[] \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)[] \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), options: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)Check if one or more rows are associated with `this`. |      |
| public         | async [remove](https://sequelize.org/api/v6/class/src/associations/has-many.js~HasMany.html#instance-method-remove)(sourceInstance: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html), targetInstances: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html) \| [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html)[] \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[] \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)[], options: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)Un-associate one or several target rows. |      |
| public         | async [set](https://sequelize.org/api/v6/class/src/associations/has-many.js~HasMany.html#instance-method-set)(sourceInstance: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html), targetInstances: [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html) \| [Model](https://sequelize.org/api/v6/class/src/model.js~Model.html)[] \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[] \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)[] \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), options: [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)Set the associated models by passing an array of persisted instances or their primary keys. |      |

######  **HasMany的别名**

​	在调用HasMany设定一对多关系时可以使用as来设置别名 ,方便调用API、设置参数等，设置别名后，在关联查询时需要给对于模型指定别名才能正确查询

```ts
  Class.hasMany(Student, {
    // 设置别名
    as:'Stus',
    // 创建的外键
    foreignKey: 'cid',
    // 参照的外键（被引用的字段,必须是主键） 默认为被引用表的外键
    sourceKey: 'cid',
    // 被引用的字段实例被删除时，将外键设置为null 若为CASCADE时，班级被删除，对应该班级所以学生都被删除
    onDelete: 'SET NULL',
    // 被引用的字段实例更新时，同时更新引用字段
    onUpdate: 'CASCADE'
  })
```

设置别名后，父表实例管理子表的API为：

<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUQAAAC0CAIAAABjbcI8AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAA00SURBVHic7Z1LkuwoEgDpsVnWWebte5WneoeYA/R56gC1mdz3XXqRZjINEMFHIAWB+0qJSCA/UYRIvPTH19dXaOT7+zuE8Hq9mp7SVL+JdDwdI7yH//z3f+/fv5SStMLUwYQQZnd35yt6HOXF3vA+/KvjOa/XqyNOPgFWU6iUV46nO4yb+h3L1ND6NB7x/v2LSB7L+/ev7Ft9Dz3B3MrUaflZvr+/H4x/gDP/bn3C8d1N4zP6WusBfFSOUuJs+bnTaADKeKTGsw+l8USva8ZfpfRveTRLHw+jg5DM5Gn5UZJtM20hGs/nbLHfJqRBSu3Xj0d6mCV9K9L2o+Gl9cP865QGvrr4+fnRS84Pj+Pis/Tyn58fqalsy9nK+hObXlcHf/71t1QSnZIe/vnX3+dTNcfZfovjqe9XQW8/Os6eah2PUj97UKxfWa6U6OUDmZVmRzPYqHT0aLZmhjxX9pQMZ6eC6Op0xnQxpE1pfutoP1v/PF3fcMVuaFruSLMlooA5p7JpCr0W9wzb1NdiKmmSvBDRsE19asOCOSTXmenk+Qn45RbDlhuwHT5f/Zt/ezsvLkxq/zh+8JfFlGFp9sXpa8hvVNJzpb8gSuOV47lnNbtmBotmDOkpdiZDOyMpUvPGtjLjm/PHV+OmEWnJOltes/IsbfDILjVLT8+O58j80wv4o3LNhhNlNbt1d0r6h/xzIF0GH2ezK6jK2rW0Rl2zJCut7ir96mRftbI4ryxKV45HeZ+V3qX3Qaqc1lfekPTs8Cy1OZjhCmYvt2Zzc/55f7or9ah84jcFs5QAcPUIxrlnj+p1ZiweMTMDOGHkavZCkO56pSPddcOmwRz8fqIK7iM55H4MO8o/BwutordyRzA37dl+hOu7ka73jsA0Cime3TM9mKMLfZubwB7Z2wAwlsF7s1tj1WBs4xU7YNG9ohe5w2c+MynHxisG0NLsms1euocc5P3Y2fo1+nHa9SjwivGK10ZyIyUHuNUHPsolRVkvqReYm8Arxiv2x01p9uffdA3MhC0sieMVK/V39oqfQkyz03/Qc9Adk1cUSMmXHs4+Xwu8YmeIwaxEXVMgDdyDWvSlQQKveAfENPszEx5I1UZ5yNn650K9QbzibuyMpMgqXvFTiKJFutlDX80+1wwtS9CKP3z2jfV28IqlVxp1jVd8g1f8FD3B7IBtL7fwisN8r/gpNAXyngUncMnOXvFT4DMDOGFfBbIJ0nKvePKfCeZaVvlEB+I+koMv/9liMOM/1/SOaDUKN/6zuWDGfwbo424FMgL/uabxCPzn4Sy6pzXi4WAugv8MUEkhzc66Funvz5KHnO7fwn/+nMJ/TsvTh1nwn0UUPbLmHss15fU69Lkc/znbb3E89f0q4D8Xyw0iptnR9HhlWut4Lv7z7H67G8F/Nou51ewz+M+mwH82jrlgxn+2AP7zihR85uNhU8bbkR7jP+tPsTMZ2hlJkd3854JoUbmanVbOriQrreE/Sw3iP2c7xX9OwZqqwv3llgT+c1jHfyaYwQT4z9chmAGcYG41eyykx17x5CGPwnkwh/0+0bBBJAdfHvIo9ro/Mx6yJ9x4yKPIB3PrLzcKpvxkPGRwTH7TyG2T54OxjYfsgEX3lk5isfszW95/A/Asl3zm7Laqg8/ZgX7yKPCQ8ZBdot3RIvx/XB3xlhaG3LWxsmdTqlZsp5U07TxK9Ivnc7Ug7DeUjrP9FsdT32/f602Ps+23jkepnz0o1q8sV0qa3jFPaGl2NoqkTdT6c4f7yXdS812Z8b0Z0qbyU01r+9n6bzxkM/T8NJWVGWr84St+8nD2+VpIssESKEIFRDQHsxKN2fTYTvTuwCO/vb3xkG3Qv5od5cwXU+iin3yU4CH3YWckRWre2FZ2+B0kvwAWrVdnH57l4SAsZSvlUV9FP1mqrKP4sdnKx9nsCqqydi2tUdcsyXZ4vzrZV60sziuL0pXjUd5npXfpfZAqp/WVNyQ96z5JdG5NbXu5dXP+eX+62yFaEMwAGvdsOL+O+0gOBDOAG/wrkFlIv73SkX67YdNgDn4/UQX3kRz29pz38pklru+Out777B53iOQPUjy7Zy+fWeKRvRYAY9nXZ5aYOk9mc7w3nvNoFt27epHFfGaJHfb3AOis5DPPvvZO/5ZLnm3RN1b2ikk7w6Q9ZOezxX6bkAYptV8/HmVLWUp2aUryLqX6YcsVzRjpXq/SfZWlmy3r90PmfstSv8Xx1PerwP2Wi+UOWNVntrAkjues1Mdzvp9lfOaa9oewz9cCz9kZK/nMA/+d0G7gOe/AMj6z3j6eczd2RlIEz1lnGZ9ZbwfPWXqlUdd4zo49502tqW0vt/Ccg1/PedNghtngOd8PwQzghE0VSNJsr+Az74jXT1TBfSQHfObZ4DPX9I44NQp85lngMwPcw2AFsjVWDcY2PrMDFt2jehF8ZgAnaGl2zaautDDajIXPHJXgM0fgMw9DciP7vGJJM8Znlvotjqe+XwV85mK5A2rT7IvTID7z7H67G8FndoOYZiv+cHdM4jObAp/ZGdo1s+QPNwUSPrMF8Jl3QEyzK6dfqdqQ36jwmW/AzkiK4DPriKKFsnSsp7utS9D4zGmD6Sl8ZqVyWh+feSO2vdzCZw74zABN4DPfD8EM4ATnCiTptFd29pYlnAdz2O8TDRtEctjbW5bYy2fGW/bEtt6yxKVgln4QitwJOz4z3jI45pICKc2x9XPvg7GNt+yARfeiTmIxn9nTfh2AsVT5zNntVkr9MwN95lHgLeMtu0TbznkOquzx+aFUfjwMwtV1+pdioFCRpp1HiX7xfK4WhP2J0nG23+J46vvte73pcbb91vEo9bMHxfqV5UpJ0zvmCTHNljZX9zHcZ76Tmu/KjO/NkDaVn2pa28/Wf+Mtm6GcZg8Mwis+83D2+VpIcsISKAIGRIjBPCrq7ETvDjzy29sbb9kG5dVsZVoeJTNLT0kL8Za7sTOSIjVvbCs7/A6iiRZRmp1eRb+EWzTXe8ghtzYmtZ+trKP4tNnKx9nsCqqydi2tUdcsyXZ4wjrZV60sziuL0pXjUd5npXfpfZAqp/WVNyQ96z5JdG5NbXu5dXP+eX+62yFaEMwAGvdsOL+O+0gOBDOAG/wrkFlIv73SkX67YdNgDn4/UQX3kRz29pz38pklru+Out777B53iOQPUjy7Zy+fWeKRvRYAY9nXZ5aYOk9mc7w3nvNoFt27epHFfGaJHfb3AOis5DPPvvZO/5ZLnm3RN1b2ikk7w6Q9ZOezxX6bkAYptV8/HmVLWUp2aUryLqX6YcsVzRjpXq/nGyBLx18t923m/szZfovjqe9XgfszF8sdsKrPbGFJHM9ZqY/nfD/L+Mwv7s88GjxnZ6zkMw/8d0K7gee8A8v4zHqbeM7d2BlJETxnnWV8Zr0dPGfplUZd4zk79pw3taa2vdzCcw5+PedNgxlmg+d8PwQzgBP2VSCbIC33iif/mWCuZZVPdCDuIzn48p9XCmY7XjT+syfc+M/LBLMpLxr/GQxytwI5iQdjG//ZAYvuaY1YNZgv5tie9v0AfMin2ekerCB4VNHerzM19SvbD7Kk0eFFjwL/Gf/ZFooeeZaQi16xdFDjJ9f40umQlGrFdlrBf8Z/tk8hzT5PjLP/rNQw3Iu+E/xnpT7+83V6VrNH/buCT9qcJs/F9q940cNx+bXIgv9snJ5gnh1F2fbtRO8O4D+vyNXV7CuzdM0E29p+0Ys+SvCf+7AzkiK7+c950aJGHj6fUgxk/d/96AvUQVjiTtsJuSVrybvOVtbBfw5Jmo3/bA2sqSrcX25J4D+HdfxnghlMgP98HYIZwAnLiBY2If32yoqeM8F8FWuf6A24j+Swpue8UjDb8Zkl8Jw9sZznvEwwm/KZJfCc4UFWVSAjDMY2nrMD1tq7umowT8qxLe/vAdDZ0Weefe2N54zn/AyKHunSZ8ZzLvargOdcLH+Q3X1mC68Lz1mpj+dcz3Y+sy5+DGTpr0UTeM5G2NFnjn7isjA5rwKes2W285n1BvGcu7EzkiJePeftfOaal4bnrIPnnD37eJaHNXUJN5dbreA5B3ueM8EMpsFzrodgBnDCMqLFs5BOe2VFb1mCYK5llU90IO4jOazpLUusFMx2fGa8ZU8s5y1LLBPMpnxmvGUwyMMK5KiYfDC28ZYdsOhe1IhNfWYL+3UAxlJIsyPZuMNDThuJCpWdW+fygT7zKPCW8ZZtoeiRinLc4TmndWpKuD9z63jq+1XAWy6WG0RMs6NpMJrW6j1naXN1H8N95jvBW1bq4y1fZ+RqthRjkuTQ2s7BFZ95OC6/Flnwlo0zMphHecizfWYogre8ImKaHU2k173iokjcVN7UTnYweMt92BlJkRnesmUKooW0mn0uTCuH3Or0K7lJcnRWb2eUzyxV1sFbDkmava23bBasqSrcX25J4C2HdT5xghlMsIq3bBmCGcAJq27nBIAIghnACQQzgBMIZgAnEMwATiCYAZxAMAM44R+aeEMF6w5UIwAAAABJRU5ErkJggg==">

###### 子表管理父表belongsTo

​	子实例拥有下列管理父表的API，这样在获取学生实例后，可以直接调用这些API来管理该学生所在的班级

```ts
 // 多个学生属于一个班级 （该操作会向学生表添加外键字段）
  Student.belongsTo(Class, {
    // 创建的外键
    foreignKey: 'cid',
    // 参照的外键（被引用的字段,必须是主键）默认为被引用表的外键
    targetKey: 'cid',
    constraints:false
  })
```

![image-20230804182232794](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20230804182232794.png)



#####  **获取关联（对于有关联的数据如何查询？）**

###### 插入

**直接插入**

  例如创建具有班级(外键约束)的学生
  注意下列方式需要先查询该班级是否存在

  ```ts
  // 张三在一班读书
  Student.create({
    sname:'张三',
    cid:1
  })
  ```
  其实就和普通的查询没啥区别

**延迟加载插入**

当然也可以使用班级实例拥有的管理API来创建学生，例如在某个班级中插入一个学生。逻辑肯定是先查询班级是否存在，再查询学生

使用sequlize

```ts
// 获取班级
const classItem = await Class.findByPk(1)
// 班级不存在
if(classItem===null)return '班级不存在'
// 班级存在,直接给当前班级插入一个学生
classItem.createStudents({sname:"张三",sage:123})

```

###### 查询

  例如查询某个班的所有学生，当前开启了一对多关联

**预先加载||关联查询**

预先加载是指从一开始就通过较大的查询一次获取所有内容的技术.

```ts
   const classItem = await Class.findOne({
      where: {
        cid
      },
      // 关联查询 开启后可以查看该班级下的所有学生信息
      include: Student
    })
```

`若在关联是设置了别名，则需要设定关联别名as才能正确的查询`

例如:学生关联班级时候设置了别名Stus，则

```ts
  Class.hasMany(Student, {
    // 设置别名
    as:'Stus',
    // 创建的外键
    foreignKey: 'cid',
    // 参照的外键（被引用的字段,必须是主键） 默认为被引用表的外键
    sourceKey: 'cid',
    // 被引用的字段实例被删除时，将外键设置为null 若为CASCADE时，班级被删除，对应该班级所以学生都被删除
    onDelete: 'SET NULL',
    // 被引用的字段实例更新时，同时更新引用字段
    onUpdate: 'CASCADE'
  })

```

```ts
 const classItem = await Class.findOne({
      where: {
        cid
      },
      // 关联查询 开启后可以查看该班级下的所有学生信息
      include: {
        model: Student,
        as:'Stus'
      }
    })
 // 查询结果为该班级信息+该班级的学生
```

​	可以看到一行代码就能完成，查询班级是否存在+查询班级下的所有学生。

*exp:若该班级下老师和学生，假定班级--老师和班级--学生都是一对多的，则查询该班级下的老师和学生数据为:*

```ts
   const classItem = await Class.findOne({
      where: {
        cid
      },
      // 关联查询
      include: [
          {
              model:Student
          },
          {
              model:Teacher
          }
      ]
    })
```

**延迟加载**

​	延迟加载是指仅在确实需要时才获取关联数据的技术。是啥，其实就是在需要某个班级的学生时调用API即可获取学生列表的技术，这些API就是前面在定义关联时就会存在了，如图，这些API就是需要时临时操作下父实例拥有的子实例。

<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX8AAADlCAIAAAA0rGChAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AABPISURBVHic7Z07sua2EUYplauUzAa0CSmfiPtxrkUo96znLuAmYj6x1uDE5YBlmgN0Nx7EgwDOiUgQBPBzyL5odOObn758+bK9g4+Pj/vpvu9O+VUi3uJc/fj4sOs7t5yX/FtS+eVfP58H//7nf5xT59L96r3Qb8SvbFyKueWXf/18jieyfYAa/KP3AP7P+eX7VuMqd+o7NUVzY9f3e3nI/Xs+jy8bdF26PnL/478qOI2cx/7V+HY2z7hs/zOIwfYBKvEi6zM6znfrfMPOR24gzoyKU7VxgBjGtj7+hGgsNBNwlt+dtbx2tMptDByAzdjWp4i71BFxHpTh+2T7Sv7qD0Az5vnTlzQPEleRHs6knKlK6rTCr2+3YM+bkppKah+gFD8NFPNyyjcl5hVTf993J8hVO+Z1L/Qrb1Ks6jJn4l1JMS/fifNDckb7ADV4kfUBgKVgdg0AfcD6AEAfalmf54u4ADA3ddd9gvnHALAseF4A0AesDwD0AesDAH3A+gBAH7A+ANCHutbn2tAAAOBQ1/oQcQcADTwvAOgD1gcA+oD1AYA+YH0AoA+1lFVLiXUBwKygLgYAfcDzAoA+xFof9HoAoCxpnhfZgwBQCjwvAOgD1gcA+oD1AYA+YH0AoA9YHwDoQ5r1Qa8HAEqRZn2IuANAKfC8AKAPWB8A6EMB68MmDADIoID1YSUIADKI1fdBrwcAylJA34dAGABkgLoYAPShlrIqRPLbn39dx8cfv3ccSWN++/OvuX+v9gOX/Rf3wfr0Z8FXcHrTs23b8cfv4s+8Su5maE3KWJ+MNemqq0XjrpH7b2TLr/TsvXaPK5ieE80Awckqc59R7JH/vvL6wqyUyXXe9z3jwxZzFLXExaSERn882XanYyJl1ZmIOO0//vidiU9Zzj8nvUfxUvrstJg4SE/mN0AkBTyv62PzDYrzHdoW56rseEli+b1TZwDGeLTGxVNtPM7vqmFG/b+WzjzoOnUONm+u5JdfJWKbfgubFKYJ9puENkit/fjxaKci4nqw074zPL/+tmQYIY9i+T7+dMYpuZ9ex8G77HLHWGjd2ZXtG5N+Vwa+J3KV2AtA92rbj19C8FjsNzie+H7zfq9/LLafOh6jvngQrB9ZbpQkPbGJaed5+d9wEQ/lajbGBNwrz+QfxbzcNV70Im0aEejU9sX69wlRgw9+cYOSRMWYl/OFi3ONQU1Am2Gv8x77ftNAOMNe51/tOXUj7kEP5bRQw61ADzfg99AlpeC+QFap/euYhIl4KnpeDycIRULv2r3G6tLD8bSJecXMEZy/ydot75luvGckQWIebCoLRkvL7HG/n2pelRiQEuNTfozJLzeiacZ4LmdQXJDebt6iPR4j5qUNXsP/U3ke2FuEfCdFDPHYDcYHbrQYkNGvjfirjRCeEbqKHI/xnI3eteegVfbrGw/EvzqiH/AE9rh3Ztklg8YuSXsPKGOXKdZHRpsTLvWwYETabF57zmqmZ2PuAwA+f//9t1j+66+/FuxllV2m3cHDmpUMDwtOsD7tWPAVnN70bOj4PKCP9TEiVovwPK/3ee+1e1zB9JxoBghsOlgff59UkTa3oaxYl6Q7gFdRfZ9XqnHJM0bP7U7HRK+qMxFx2n+g41OaQbeJ9KX//6Q80ITlzoKZqQBlSfO8YtKa/ULHLdL2don1nXvFU3ucTjt+drU2Tr/94obS/2up6cgE9XSMLGctp1nLfr5fDfabhDZIrf348RjJ0D7ierAm06HV35YMI5QlId/nQ9HE8ddxYuRvjO0UkXo6GeWbt/Eio988DNkXewEoRk9HOxb7DY4nvt+83+sfi+2njieov+McBOtHlhslSU/sVbTJ9+nmee37vjcX2XliPt7gIca83DVe9CJtGhHo1PbF+gc6PqOR4HmJbstJthHRvLCHFDFqu6JPVJx13mNtZ+YQGLtPIY8E62OYiaQvs8F+llLtF/S8VqNLSsGBjs9QJHhe51zgQqsWsxIcg1g/o/Hsfu0b28S8YuYIBzo+1Yh5sKkQLb3IXHV2Tm0PxQ5UBevfb9l/1N8Jlos1/dOMcWqr5hqGvoxY+boqxlmMCJcWyYoJ3GTo5tiIv9oI4Rmhq8jxGM/Z6F17Dlplv77xQPyr759Ht1l1LmN9IMiySwaNXZL2HlDGLtP3fzuvsz5b/f/HCiCbNpvXnvN+07O90/oAAJQChY2Xgqc2Kxme2qxgfd7LIq/gnelNz4Ye0I0xrE8wTDY9z/ODn/deu8cVTM+JZoBWYwDr48fairS5DWXFuiTvAVSlv8KGQ5GkxCDP7U7HhLGqMxFx2n+gB1SaQbeblOV11ifIQBOWO2S4Ajgke15GlvC9XMwbvmck++04Wxyucm0nqlhf69cfp9iU3078OP32ixtK/6+lpkcT1OUxsqW13Ggti/p+NdhvEtogtfbjx2MkVfuI68Ga3IdWf1syjBDgSwqfn5/+8b0wslxsRzy9l4uX/MKM8RQZZ+QPieTrt+9aiXNJO/367fv9Usyx2G9wPPH9GtjtO8fipdTxGPXFg2D9yHKjxC6fjwTPy5mANNbK2fd9Rw8oEfSAjProAXVngJjXHfSAtpXeY/SA5mYA69NgXwx6QN1BD2hBkvV9rtOk+ULG5KJI6D1mmblUv/aNbWJe6AH1BT2gJJJ3mUbGvPzKYjzIaA09IPSA0AM6mXUezR73l7LskgF6QNuAekB5YH1gUdAD6g7WBwD6MEDMayzwmGYFXZ7iYH3Ks+ArOL3p2dDlqUAf61N7P9R7QJdnJtDlKUus9UkNGNtNraPXgy4PgEZstmGzDzvPGA2h14MuzwQMuu3jnfTX93nhhOXOxJmmAH0prO8jJvhenFcH0uspBbo86PKAT9r/Zbr9+NFeH7ZfuEnrO8Y2Ba2a0U5GuTh+rd88fE/kKrEXgO7VNmUrgHYs9hscT3y/eb/XPxbbTx2PUV88CNaPLDdKkp4YXKR5XuL3GZyJiPfu++5v/qrNy728i5iXu8aLXqRNIwKd2r5Y/0CXZxbKRNx9v0Y89W/UvLAi43kb67zH2k7LITB2k0JZClgfw3zEeEY1GGWOMwFdUgoOdHmmoGTMy5lxPJyAiLfHLDPHX4qp3ybmFTNHONDlqUbMg02FaGmQ2FVnJ1Qknu66aM6mLw9pwS8tpiZ2YXRtDFjsRQzbxU+mDL0YsfJ1VYyzGBEuLZIVE7jJ0MGxEX+1EcIzQleR4zGes9G79hy0yn5944H4VxtM84eGPe6FWXbJoLFL0t4DythlivWxwfrAYLTZvPYcTE8QrA8A9AGFjUbgkc1KhkcGJ1ifdiz4Ck5vejZ0fx6Avk8fnucBP++9do8rmJ4TzQCBDfo+feiSpAfwKtD3edRvEarORMRp/4HuT2kG3VbSF/R9MiGTFeAh6PvI/RrjL4j/11LTnQnq7xhZ0VoOtJYtfb8a7DcJbZBa+/HjMZKnfcT1YE3WQ6u/LRlGKAv6Psn95mHIxNgLQDH6O9qx2G9wPPH95v1e/1hsP3U8Qb0e5yBYP7LcKEl6YguCvk+Le0sR83LXeNGLtGlEoFPbF+sf6P6MBvo+KjHjL8I677G2k3MIjN2qkAf6PrHtsG0niS4pBQe6P0OBvo9a376xTcwrZo5woPtTjZgHmwrR0gv0fdxeIseprZprGHo0YuXrqhhnMSJcWiQrJnCTobNjI/5qI4RnhK4ix2M8Z6N37Tlolf36xgPxrzKPPmGPeyOWXTJo7JK094AydplifU6wPjAJbTavPQfTc4H1AYA+oLDRCDyvWcnwvOAE69OOBV/B6U3Phr7PA9D36cPzfN/nvdfucQXTc6IZILDpYH3EDV/P29yGsmJdkvEAXkV1hY3sZL8kntudjglgVWci4rT/QN+nNINuH+kL+j6ZkLEK8JA0zysmfdkvdNwibWepWF/MPw7uqtdynXf0fdD3Qd/nNaTp+8TsGrVP7+Ub+j7o+6DvszD5ntfDicC+7zv6PonEvNw1XvQibRoR6NT2xfoH+j6jkeB57breTbYR0bywhxQxasbvLcs677G2Y3MIjF2pkEfauo/miSR9mQ32uZRqv6DntRpdUgoO9H2GIsHzipxQxKwEZ7eT0Xh2v/aNbWJeMXOEA32fasQ82FSIll4kq8pfaJ6XFsyK1M3x699v2dH3Qd/HHI/xnI3eteegVfbrGw/Ev8o8+oQ97o1YdsmgsUvS3gPK2GWK9TnB+sAktNm89hxMzwXWBwD6gMJGYfCwZiXDwwIbrE95FnwFpzc9Gzo+FUDfpy7P83qf9167xxVMz4lmgCCPwtbH2L213aLdRfKkY/rtTpekO4AhKKywoX3/8XYhzxg9tzvNUgcrmR5x2n+g41OaQbeJvBP0fQKQmQpQiUx9HzHx16h/R9tZ6mxx0GQx/FO7X6cd/yeI/ZbF/2up6cgE9XSMLGctp1nLfr5fDfabhDZIrf348RjJ0D7ierAm06HV35YMI7QhU99HO76fauXX6fZufZ88DNkXewEoRk9HOxb7DY4nvt+83+sfi+2njieov+McBOtHlhslSU8MLhI8r+CMI4l93/eh9H1aEvNy13jRi7RpRKBT2xfrH+j4zEKO51XQamhe2EPeuVKzznus7cwcAmP3KZQlwfqUMhMN9rmMMseZgC4pBQc6PlOQE/MyZhZJy88ZvWS0n9q1U79NzCtmjnCg41ONmAebCtHSIGm7TB3Py18JitHfcf5J7NTEjPa3Hy2IX9M/1frVCg0MfRmx8nVVjLMYES4tkhUTuMnQzbERf7URwjNCV5HjMZ6z0bv2HLTKfn3jgfhXG0zzh4Y97oVZdsmgsUvS3gPK2GWK9bHB+sBgtNm89hxMTxCsDwD0AYWNRuCRzUqGRwYnWJ92LPgKTm96NnR/HoC+Tx+e5wE/7712jyuYnhPNAIEN+j596JKkB/Aq0Pd51G8Rqs5ExGn/ge5PaQbdVtIX9H0yIZMV4CHo+8j9iu0XN5T+X0tNdyaov2NkRWs50Fq29P1qsN8ktEFq7cePx0ie9hHXgzVZD63+tmQYoSzo+yT3m4chE2MvAMXo72jHYr/B8cT3m/d7/WOx/dTxBPV6nINg/chyoyTpiS0I+j4t7i1FzMtd40Uv0qYRgU5tX6x/oPszGuj7qDg/s571Wec91nZyDoGxWxXyQN8nth227STRJaXgQPdnKND3UevbN7aJecXMEQ50f6oR82BTIVp6gb6P24u2vCWG+eJnQ4YejVj5uirGWYwIlxbJigncZOjs2Ii/2gjhGaGryPEYz9noXXsOWmW/vvFA/KvMo0/Y496IZZcMGrsk7T2gjF2mWJ8TrA9MQpvNa8/B9FxgfQCgDyhsvBQ8tVnJ8NRmBevzXhZ5Be9Mb3o29IBujG19guGzaXieH/y899o9rmB6TjQDtBoDWx9x49jzNrdXWrEuyXsAVemvsFGJPGP03O40S0GsZHrEaf+BHlBpBt1uUpZ5rM8LJyx3yHAFcIj1vPys4k1JC/azjZ1Ldv3I9q+aWqr09qMbJeYxB3fta+O0B1nPffP/Wmp6NEFdHiNbWsuN1rKo71eD/SahDVJrP348RlK1j7gerMl9aPW3JcMIAb6k8Pn5+fn5eR07B1q5cxCsbxyLp06JWC2y38jy+OFl8/Xbd63EuaSdfv32/X4p5ljsNzie+H4N7PadY/FS6niM+uJBsH5kuVFil89Hsud1n3qUtYN5DKcT1BL0gIz66AF1p0zMq8jHf3lSvj8VbP/NOkHFWec9Rg9obspYny56PQ32y4wyx5kA9IAWpHzM68l8IWYKk9q+WD9mmblsv21iXugB9QU9oCRid5nGiN3cL4nKO37ASGzKCGNteqDqtTpBRqEBekCb53mhBzQZ7HF/KcsuGaAHtC2jB4T1gUVBD6g7WB8A6MPAu0zXBI9sVhbU/cH6jMdkr2AM05uebUndn7GtTzDsNT3o/szEaro/A1ufj5X0fTTQ/YFxmUdhwyHPGA2h76OB7s8EDLqtJI95rM9AE5Y7E2eyAtig7+O2Lzblt2MM0sixdm4pBbo/6P4MSZIeB/o+fo9BfZ+yAkDo/qD7Mw3o+2R22uXeUqD7Y9RH96cZ6PtYFPxd99PnbYqs8x6j+zMH6Psk9/uwnYm37dQA3Z+JQd8ntvHsfu0b28S80P3pC7o/Iuj7qKMN/i7/VOw35tHFz4bQ/dk8zwvdn0Fhj/tgLLtkgO7PNp3uD9YH4AfQ/WkG1gcA+jDwLtO5wcOalQV1fDSwPu9lkVfwzvSmZ1tSx0djbOtTe//Ue0DHZyZW0/HRGNj6fKyk74OOD8zH6xQ2SiVQ5bXz3O40Sx1Ex2doBt0mUpbXWZ9sXjhhuTNBZipAWZI9LyPZ15C82fScY7/QyFG+l2vbMsR2xPxjLR3Z6NdP1/Ybqee+oeODjs9UJOlxGBI8Gbo/fp2YkuH0ffJAxwcdn+lJ8LyciYbzt/0+JbHbCc44ktj3fR9K36cl6PgY9dHx6U7dmJft0cRbjWC1mM3xGbxzpWad9xgdn7mpa31K6fKUaieVUeY4E4COz4IkeF7OVCV1XuDXt1uIWQnO6zev8Yf9tol5oePTlxo6PhOTvMtUi3ndC/3KmxTDcsR0/Kt2O8FEZ6Odlvo+RqEBOj6b53ktq+MzK+xxfynLLhmg47Mt8y+O9YFFGUXHZ2KwPgDQh3l2WgDAWGB9AKAPWB8A6APWBwD6gPUBgD5gfQCgD1gfAOjDz+/cxg0A00O2IQD0Ac8LAPqA9QGAPvwX+peN5Z4/R7AAAAAASUVORK5CYII=">

```ts
   // 查询一个班级
	const classItem = await Class.findOne({
      where: {
        cid
      }
    })
    // 班级不存在
    if (classItem === null) return Promise.resolve(0)

    // 班级存在 临时获取该班级下的所有学生
    const students = await classItem.getStudents();
	// 获取该学生所属的班级（调用此方法必须学生模型也需要关联在班级模型中）
    await students[0].getClass()
```

##### 延迟加载和预先加载业务比较

```ts
  /**
   * 获取班级里的所有学生
   * @param cid 班级id
   */
  async getAllStudents (cid: number) {
    // 预先加载技术
    // const classItem = await Class.findOne({
    //   where: {
    //     cid
    //   },
    //   // 关联查询 开启后可以查看该班级下的所有学生信息
    //   include: {
    //     model: Student,
    //     // as:'Stus' 若在关联时设置了别名需要指定别名
    //   }
    // })
    // // 班级不存在
    // if (classItem === null) return Promise.resolve(0)
    // // 存在
    // return classItem

    // 延迟加载技术
    const classItem = await Class.findByPk(cid)
    if (classItem === null) return Promise.resolve(0)
    // @ts-ignore
    return Promise.resolve(await classItem.getStudents())

  }
}
```

