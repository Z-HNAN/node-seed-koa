const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')

// 配置
const conf = require('../conf')
const now = require('./utils/now')

// 实例对象
const app = new Koa()
const router = new Router()

app.use(bodyParser())


// 连接数据库
const URL = conf.mongoURL
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`${now()} connect mongo success`)
  })
  .catch(err => {
    console.log('connect mongo failure', err)
  })

// 配置路由表
router.use('/api/users', require('./routes/api/Users'))

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

// 开启服务
const PORT = conf.port || 3000
app.listen(PORT, () => {
  console.log(`${now()} server run at port ${PORT} `)
})
