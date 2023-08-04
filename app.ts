import Koa from 'koa'
import RootRouter from './router'
import KoaBody from 'koa-body'
// 创建数据库表
import './model'

const app = new Koa()

app.use(KoaBody())
app.use(RootRouter.routes())

app.listen(3000, () => console.log('127.0.0.1:3000'))