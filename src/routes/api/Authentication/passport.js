const passport = require('koa-passport')
const passportJWT = require('passport-jwt')
const isNuid = require('../../../utils/isNuid')

const User = require('../../../modules/User')

const { Strategy: JwtStrategy, ExtractJwt } = passportJWT

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

opts.secretOrKey = 'secret'

/**
 * JWT验权方式
 */
passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id)

    /**
     * 当前并无此用户
     */
    if (isNuid(user)) {
      return done(null, false)
    }

    return done(null, user)
  } catch (error) {
    console.error(error)
    return done(error, false)
  }
}))

module.exports = passport
