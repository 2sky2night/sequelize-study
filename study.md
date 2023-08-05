## 1.使用须知
  看文档操作
  https://www.sequelize.cn/other-topics/constraints-and-circularities 官方文档
  https://demopark.github.io/sequelize-docs-Zh-CN/core-concepts/assocs.html 这个最好
  https://blog.csdn.net/qq_30960005/article/details/105324795 配套案例
  https://www.bookstack.cn/read/sequelize-5.x-zh/spilt.3.associations.md 
  https://clwy.cn/guide/pages/sequelize-v5-associations

## 2.sequlize连接数据库
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

## 3.案例的关系
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

## 4.模型
  模型即是ORM的精髓，将数据元组映射成对象就靠的模型。使用sequlize就可以帮我们快速建立映射，并创建表。sequlize既可以使用模型创建表，也可以映射到现有表中。下面来快速的创建模型吧~
### 1.班级模型
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
    }
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

### 2.学生模型
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
  declare cid: number | null;
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
    // 声明的外键
    cid: {
      type: DataTypes.BIGINT,
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

### 3.课程模型

```ts
import { DataTypes, Model } from "sequelize";
import sequelizeIns from "../../config/database";
import type { InferAttributes, InferCreationAttributes, CreateOptions } from 'sequelize'

/**
 * 课程模型
 */
class Course extends Model<InferAttributes<Course>, InferCreationAttributes<Course>>  {
  declare course_id: CreateOptions<number>;
  declare course_name: string;
  declare createdAt: CreateOptions<Date>;
  declare updatedAt: CreateOptions<Date>;
}

Course.init(
  {
    course_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    course_name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize: sequelizeIns,
    freezeTableName: true,
    modelName: 'Course'
  }
)

export default Course
```





## 5.模型关联

  数据库实体和实体之间是有关系的，对于有关系的表，也可以使用sequlize来定义关系，然后再创建表，模型间建立关系后，可以使用sequlize封装的API快速管理两个实体间的数据。

这篇文档有详情的介绍模型关联的使用方式

[Associations - 关联 | sequelize-docs-Zh-CN (demopark.github.io)](https://demopark.github.io/sequelize-docs-Zh-CN/core-concepts/assocs.html)

https://juejin.cn/post/7083051152639524895#heading-15

省流：

- 创建一个 **一对一** 关系, `hasOne` 和 `belongsTo` 关联一起使用;

- 创建一个 **一对多** 关系, `hasMany` he `belongsTo` 关联一起使用;

- 创建一个 **多对多** 关系, 两个 `belongsToMany` 调用一起使用.

- 为啥需要成对使用？例如A和B实体是一对多的关系，所以使用 A.hasMany(B)，A知道了自己关联了B，但是B不知道关联了A会造成A实例可以拥有管理B实例的API，但B实例没相应的API进行操作A

- 因此,为了充分发挥 Sequelize 的作用,我们通常成对设置关系,以便两个模型都 互相知晓，不然只能通过原始的查询器进行操作了。

  
### 5.1 一对多关系

####   **1.模型与模型之间的关联创建**

​	班级和学生是一对多的关系，由此创建联系

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

####   **2.一对n关系创建时注意事项**

##### 	**父表管理子表HasMany**

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

#####  **HasMany的别名**

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

##### 子表管理父表belongsTo

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



####  **3.获取关联（对于有关联的数据如何查询？）**

##### 插入

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

##### 查询

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

<img src="data:image/png;base64,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">

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

##### 编写将学生移除班级的接口

```ts
  /**
   * 将学生移除班级
   * @param cid 班级id
   * @param sid 学生id
   */
  async removeJoinClass(cid: number, sid: number) {
    // 查询班级和学生是否存在
    const res = await checkStudentAndClassExist(sid, cid)
    if (typeof res === 'number') {
      return Promise.resolve(res)
    }
    const [student, classItem] = res

    // 1.使用模型
    // 学生存在 查询是否已经加入班级了?
    // if (student.cid === null) {
    //   // 未加入班级 不能移除
    //   return Promise.resolve(0)
    // } else {
    //   // 加入班级了
    //   student.set('cid', null)
    //   await student.save()
    //   return Promise.resolve(1)
    // }
    // 2.使用延迟加载技术
    if (await classItem.hasStudent(student)) {
      await classItem.removeStudent(student)
      return Promise.resolve(1)
    } else {
      // 不存在 不能移除
      return Promise.resolve(0)
    }
  }
```



##### 编写将学生添加进入班级的接口

​	用模型可以更偏向底层，使用延迟加载技术，更低耦合？，看自己喜好。

​	主要使用了has，has可以查看父实例是否拥有该子实例，再通过add来将父实例与子实例建立关联。

```ts
  /**
   * 将学生添加进入班级
   * @param cid 班级id
   * @param sid 学生id
   * @returns -2班级存在 -1学生不存在 0学生已经进入班级了 1添加成功
   */
  async joinClass(cid: number, sid: number) {

    // 查询班级和学生是否存在
    const res = await checkStudentAndClassExist(sid, cid)
    if (typeof res === 'number') {
      return Promise.resolve(res)
    }
    const [student, classItem] = res

    // 1.使用模型
    // 学生存在 查询是否已经加入班级了?
    // if (student.cid === null) {
    //   // 未加入班级 设置班级id
    //   student.set('cid', cid)
    //   await student.save()
    //   return Promise.resolve(1)
    // } else {
    //   // 加入班级了
    //   return Promise.resolve(0)
    // }

    // 2.使用延迟加载技术
    if (await classItem.hasStudent(student)) {
      // 存在该学生
      return Promise.resolve(0)
    } else {
      // 不存在 加入该班级
      classItem.addStudent(student)
      return Promise.resolve(1)
    }


  },
```



#### 4.延迟加载和预先加载业务比较

延迟加载提供的API需要如何给实例声明？https://www.bookstack.cn/read/sequelize-nodelover/document-3.4%E5%A4%9A%E5%AF%B9%E5%A4%9A.md

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

#### 5.创建一对多关联后需要添加的TS声明

​	在使用hasMany和belongsTo创建一对多关联后，两个实例都会自动拥有相互操作的API，但是我们想要得到这些API的类型提示要怎么办？

​	参考的https://juejin.cn/post/7083051152639524895#heading-15

```ts
/**
 * 班级模型（一个班级管理多个学生）
 */
class Class extends Model<InferAttributes<Class>, InferCreationAttributes<Class>>  {
  // 类型定义 CreationOptional为创建或更新时可以传入的选项
  declare cid: CreationOptional<number>;
  declare cname: string;
  declare updatedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  // 一对多学生后自动给实例添加API
  /**
   *  获取该班级下的所有学生
   */
  declare getStudents: HasManyGetAssociationsMixin<Student>;
  /**
   * 在该班级下创建学生
   */
  declare createStudent: HasManyCreateAssociationMixin<Student>;
  //... 剩余API可以通过需要来声明
}

/**
 * 学生模型 
 */
class Student extends Model<InferAttributes<Student>, InferCreationAttributes<Student>> {
  // 下面这些是对模型中的字段定义，定义他们能够享有更好的ts体验，访问元组时有类型提示
  // CreationOptional，代表可选参数，插入或更新时可以不需要传递的内容;
  declare sid: CreationOptional<number>;
  declare sname: string;
  declare sage: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare cid: number | null;
  /**
   * 获取当前学生的班级
   */
  declare getClass: BelongsToCreateAssociationMixin<Class>;
  // 其余API可以自己按照需求声明
}
```



### 5.2 多对多关系

​	多对多关系最好是提前创建中间模型，根据文档中直接通过belongsToMany可能不会根据关系来创建表（模型）

#### 创建模型

创建学生和课程的关联模型:

```ts
import { DataTypes, Model } from 'sequelize'
import sequelizeIns from '../../config/database';
import type { CreationOptional } from 'sequelize';

/**
 * 学生选课模型
 */
class StudentCourse extends Model {
  /**
   * 选课成绩
   */
  declare score: CreationOptional<number>;
  /**
   * 课程id
   */
  declare course_id: number;
  /**
   * 选课学生id
  */
  declare sid: number;
}


StudentCourse.init(
  {
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  },
  {
    sequelize: sequelizeIns,
    modelName: 'StudentCourse',
    tableName:'student_course',
    freezeTableName: true,
  }
)

export default StudentCourse
```

#### 声明关系

两个实体之间创建多对多关系可以通过belongsToMany来声明。

​	本案例中通过`Student.belongsToMany(Course, {through: StudentCourse})` 来声明学生有多个课程，再通过`Course.belongsToMany(Student, {through: StudentCourse})`来声明课程拥有多个学生。

​	through是必选的字段，代表两个多对多关系建立的模型，若传入模型则以该模型来建立连接，若传入字符串会直接创建模型。

```ts
import StudentCourse from 'model/StudentCourse'
/**
 * 学生和课程之间的关系 多对多
 */
function StudentAndCourseRelation() {

  // 建议双向声明，这样两个模型可以相互管理，也就是两个实例都会拥有管理的API

  // 调用该函数时 source为调用者模型，target为第一个参数的模型
  Student.belongsToMany(Course, {
    // 若传入字符串就会根据关系来创建表
    through: StudentCourse,
    // 指定source(学生表)引用表的外键（将学生表中的主键作为外键引用）
    foreignKey: 'sid',
    // 指定target(课程表)引用的外键 (将课程表的主键作为外键引用)
    otherKey: 'course_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })

  Course.belongsToMany(Student, {
    // 创建的模型（表）
    through: StudentCourse,
    // 指定scource（课程表）的外键
    foreignKey: 'course_id',
    // 指定target（学生表）的额外键
    otherKey: 'sid',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })

}
```

两个实体实例都拥有的管理对方的API函数。例如上述代码执行后

​	Course拥有操作Student的API：

<img src="data:image/png;base64,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">

​	Student拥有操作Course的API

​								<img src="data:image/png;base64,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">

#### 多对多之间的增删改查

##### 	编写一个学生选择课程的接口

​	以下操作不管使用预先加载、延迟加载还是使用模型来进行操作都是可以的啊，实现方法有很多种，看自己喜欢，可以引入StudentCourse模型来进行查询学生是否选择了该课程，也可以使用延迟加载技术调用封装好的API。

```ts
  /**
   * 学生选择课程
   * @param sid 学生id
   * @param course_id 课程id
   * -2学生、-1课程不存在，0学生以及选择了该课程了 1成功
   */
  async studentChooseCourse(sid: number, course_id: number) {
    // 查询学生和课程是否存在
    const res = await checkStudentAndCourseExist(sid, course_id)

    if (typeof res === 'number') {
      // 不存在
      return Promise.resolve(res)
    }
    // 存在
    const [student, course] = res
    // 查询该学生是否选择了该课程
    const resExist = await student.hasCourse(course)

    if (resExist) {
      // 存在了
      return Promise.resolve(0)
    } else {
      // 不存在 选择该课程

      // 1.使用延迟加载
      // await student.addCourse(course) 这句话是指在学生选择课程表中插入一条学生选择课程的记录

      await student.addCourse(course, {
        // through 代表两个模型之间的关联表
        // 值为一个对象，每个key都是关联表中的字段
        // 这句话的意思是在学生选择课程表(StudentCourse)中插入学生选择课程的记录，并让学生的该门课程成绩为0
        through: {
          score: 100
        }
      })

      // 2.使用模型来添加关联数据
      // StudentCourse.create({
      //   sid,
      //   course_id,
      //   score: 55
      // })

      return Promise.resolve(1)
    }
  },
```

##### 编写一个修改学生成绩的接口

```ts
  /**
   * 更新学生成绩
   */
  async updateCourseGrades(sid: number, course_id: number, score: number) {
    // 查询学生和课程是否存在
    const res = await checkStudentAndCourseExist(sid, course_id)

    if (typeof res === 'number') {
      // 不存在
      return Promise.resolve(res)
    }

    // 存在
      
    // 1.使用延迟技术
    // const [student, course] = res
    // // 查询该学生是否选择了该课程
    // const resExist = await student.hasCourse(course)
    // if (resExist) {
    //   // 选择了,这种方式为批量更新
    //   await student.setCourses([course], {
    //     through: {
    //       score
    //     }
    //   })

    //   return Promise.resolve(1)
    // } else {
    //   // 未选择课程
    //   return Promise.resolve(0)
    // }
      
    // 2.使用模型
    // 学生是否选择了课程
    const item = await StudentCourse.findOne({
      where: {
        sid,
        course_id
      }
    })
    if (item) {
      // 选择了 设置该学生的这门课程成绩
      await item.update({
        score
      })
      return Promise.resolve(1)
    } else {
      // 未选择
      return Promise.resolve(0)

    }

  },
```

##### 编写一个学生取消修读课程接口

```ts
  /**
   * 学生取消修读课程
   * @param sid 学生id
   * @param course_id 课程id
   */
  async removeStudentChooseCourse(sid: number, course_id: number) {
    // 查询学生和课程是否存在
    const res = await checkStudentAndCourseExist(sid, course_id)

    if (typeof res === 'number') {
      // 不存在
      return Promise.resolve(res)
    }
    // 存在 

    // 1.使用延迟技术
    // const [student, course] = res
    // // 查询该学生是否选择了该课程
    // const resExist = await student.hasCourse(course)
    // if (resExist) {
    //   // 选择了,取消修读的课程 移除关联表中的数据
    //   student.removeCourse(course)
    // } else {
    //   // 未选择课程
    //   return Promise.resolve(0)
    // }

    // 2.使用模型
    const item = await StudentCourse.findOne({
      where: {
        sid,
        course_id
      }
    })
    if (item) {
      // 选择了 移除
      await item.destroy()
      return Promise.resolve(1)
    } else {
      // 未选择
      return Promise.resolve(0)

    }

  }
```



### 5.3 创建联系后添加到实例的特殊方法（创建模型关联前必看）

​	当使用belongsTo、hasMany、BelongsToMany、hasOne等API后会给调用者的原型添加操作目标模型的API

例如,如果我们有两个模型 `Foo` 和 `Bar`,并且它们是关联的,则它们的实例将具有以下可用的方法,具体取决于关联类型：

#### `Foo.hasOne(Bar)`声明一对一

- `fooInstance.getBar()`
- `fooInstance.setBar()`
- `fooInstance.createBar()`

示例:

```
const foo = await Foo.create({ name: 'the-foo' });
const bar1 = await Bar.create({ name: 'some-bar' });
const bar2 = await Bar.create({ name: 'another-bar' });
console.log(await foo.getBar()); // null
await foo.setBar(bar1);
console.log((await foo.getBar()).name); // 'some-bar'
await foo.createBar({ name: 'yet-another-bar' });
const newlyAssociatedBar = await foo.getBar();
console.log(newlyAssociatedBar.name); // 'yet-another-bar'
await foo.setBar(null); // Un-associate
console.log(await foo.getBar()); // null
```

#### `Foo.belongsTo(Bar)`声明Foo属于Bar

来自 `Foo.hasOne(Bar)` 的相同内容:

- `fooInstance.getBar()`
- `fooInstance.setBar()`
- `fooInstance.createBar()`

#### `Foo.hasMany(Bar)`声明Foo有多个Bar

其中

**create**是创建Bar并指定一对多关联Foo

**add**是指定Bar关联上Foo

- `fooInstance.getBars()`
- `fooInstance.countBars()`
- `fooInstance.hasBar()`
- `fooInstance.hasBars()`
- `fooInstance.setBars()`
- `fooInstance.addBar()`
- `fooInstance.addBars()`
- `fooInstance.removeBar()`
- `fooInstance.removeBars()`
- `fooInstance.createBar()`

示例:

```
const foo = await Foo.create({ name: 'the-foo' });
const bar1 = await Bar.create({ name: 'some-bar' });
const bar2 = await Bar.create({ name: 'another-bar' });
console.log(await foo.getBars()); // []
console.log(await foo.countBars()); // 0
console.log(await foo.hasBar(bar1)); // false
await foo.addBars([bar1, bar2]);
console.log(await foo.countBars()); // 2
await foo.addBar(bar1);
console.log(await foo.countBars()); // 2
console.log(await foo.hasBar(bar1)); // true
await foo.removeBar(bar2);
console.log(await foo.countBars()); // 1
await foo.createBar({ name: 'yet-another-bar' });
console.log(await foo.countBars()); // 2
await foo.setBars([]); // 取消关联所有先前关联的 Bars
console.log(await foo.countBars()); // 0
```

getter 方法接受参数,就像通常的 finder 方法(例如`findAll`)一样：

```
const easyTasks = await project.getTasks({
  where: {
    difficulty: {
      [Op.lte]: 5
    }
  }
});
const taskTitles = (await project.getTasks({
  attributes: ['title'],
  raw: true
})).map(task => task.title);
```

#### `Foo.belongsToMany(Bar, { through: Baz })`声明多对多

来自 `Foo.hasMany(Bar)` 的相同内容：其中add、set、remove都是操作关联表的数据，并不会操作源和目标表的数据，create是创建Bar并将多对多关系插入到关联表中。

- `fooInstance.getBars()`
- `fooInstance.countBars()`
- `fooInstance.hasBar()`
- `fooInstance.hasBars()`
- `fooInstance.setBars()`
- `fooInstance.addBar()`
- `fooInstance.addBars()`
- `fooInstance.removeBar()`
- `fooInstance.removeBars()`
- `fooInstance.createBar()`

对于 belongsToMany 关系, 默认情况下, `getBars()` 将返回连接表中的所有字段. 请注意, 任何 `include` 参数都将应用于目标 `Bar` 对象, 因此无法像使用 `find` 方法进行预加载时那样尝试为连接表设置参数. 要选择要包含的连接表的哪些属性, `getBars()` 支持一个 `joinTableAttributes` 选项, 其使用类似于在 `include` 中设置 `through.attributes`. 例如, 设定 Foo belongsToMany Bar, 以下都将输出没有连接表字段的结果:

```
const foo = Foo.findByPk(id, {
  include: [{
    model: Bar,
    through: { attributes: [] }
  }]
})
console.log(foo.bars)

const foo = Foo.findByPk(id)
console.log(foo.getBars({ joinTableAttributes: [] }))
```

#### 注意: 方法名称

如上面的示例所示,Sequelize 赋予这些特殊方法的名称是由前缀(例如,get,add,set)和模型名称(首字母大写)组成的. 必要时,可以使用复数形式,例如在 `fooInstance.setBars()` 中. 同样,不规则复数也由 Sequelize 自动处理. 例如,`Person` 变成 `People` 或者 `Hypothesis` 变成 `Hypotheses`.

如果定义了别名,则将使用别名代替模型名称来形成方法名称. 例如：

```
Task.hasOne(User, { as: 'Author' });
```

- `taskInstance.getAuthor()`
- `taskInstance.setAuthor()`
- `taskInstance.createAuthor()`



