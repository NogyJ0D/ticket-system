const { Router } = require('express')
const tokenCookie = require('../helpers/tokenCookie')
const { isHelper } = require('../middlewares/auth')

const AuthServices = require('../services/auth')
const auth = app => {
  const router = Router()
  const authService = new AuthServices()
  app.use('/auth', router)

  router.post('/signup', async (req, res) => {
    const response = await authService.signup(req.body)

    response.fail
      ? res.status(400).json(response)
      : tokenCookie(res, response)
  })

  router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const response = await authService.login(email, password)

    response.fail
      ? res.status(400).json(response)
      : tokenCookie(res, response)
  })

  router.post('/logout', (req, res) => {
    return res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date()
    }).json({ loggedOut: true })
  })

  router.post('/validate', isHelper, async (req, res) => {
    const response = await authService.validateUser(req.user)
    return tokenCookie(res, response)
  })
}

module.exports = auth
