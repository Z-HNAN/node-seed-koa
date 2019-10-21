const Router = require('koa-router')
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const passport = require('./passport')

const User = require('../../../modules/User')

const router = new Router()

/**
 * JWT鉴权验证器
 */
const authorizationJWTMiddleware = passport.authenticate('jwt', { session: false })

/**
 * 获取当前登录用户信息
 */
const currentRouter = async (ctx) => {
  const {
    _id: id,
    name,
    email,
  } = ctx.state.user

  try {
    ctx.body = {
      id,
      name,
      email,
    }
  } catch (error) {
    ctx.body = {
      success: false,
      errMsg: error.message,
    }
  }
}

/**
 * 登录接口
 */
const loginRouter = async (ctx) => {
  const { name, password } = ctx.request.body

  try {
    // 1.验证账号
    const userResult = await User.find({ name, password: md5(password) })
    if (userResult.length === 0) throw new Error('用户名或密码错误');
    const userInDB = userResult[0]

    // 2.发布token
    const payload = { id: userInDB._id }
    const token = jwt.sign(payload, 'secret', { expiresIn: 3600 })
    ctx.body = {
      success: true,
      token: `Bearer ${token}`,
    }
  } catch (err) {
    ctx.body = {
      success: false,
      errMsg: err.message,
    }
  }
}

/**
 * 登出接口
 */
const logoutRouter = async (ctx) => {

}

/**
 * 注册接口
 */
const registerRouter = async (ctx) => {
  const {
    name,
    password,
    email,
  } = ctx.request.body

  try {
    /* 1.检验数据 */
    // ....
    if (name.trim() === '') throw new Error('用户名不能为空')

    /* 2.转换对象的password */
    const md5Password = md5(password)

    /* 3.存储数据库 */
    const queryResponse = await User.find({ email })
    if (queryResponse.length > 0) throw new Error('该用户名已经存在')

    const user = new User({
      name,
      password: md5Password,
      email,
    })

    const userInDB = await user.save()

    /* 4.返还数据 */
    ctx.body = {
      success: true,
      data: userInDB,
    }
  } catch (err) {
    ctx.body = {
      success: false,
      errMsg: err.message,
    }
  }
}


/**
 * @route GET api/current
 * @desc 获取当前登录用户信息
 */
router.get('/current', authorizationJWTMiddleware, currentRouter)
/**
 * @route POST api/login
 * @desc 登录
 */
router.post('/login', loginRouter)
/**
 * @route POST api/logout
 * @desc 登出
 */
router.post('/logout', logoutRouter)
/**
 * @route POST api/register
 * @desc 注册
 */
router.post('/register', registerRouter)

module.exports = router.routes()
