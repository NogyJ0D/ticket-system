const { Router } = require('express')
const { isHelper } = require('../middlewares/auth')
const UsersServices = require('../services/users')

const users = app => {
  const router = Router()
  const userService = new UsersServices()
  app.use('/users', router)

  router.get('/', isHelper, async (req, res) => {
    const response = await userService.getAll()

    return res.status(200).json(response)
  })
}

module.exports = users
