const Users = require('./users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config')
const sendEmail = require('../libs/email')

class Auth {
  constructor () {
    this.users = new Users()
  }

  getToken (user) {
    const data = {
      username: user.username,
      email: user.email,
      role: user.role,
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname
    }
    const token = jwt.sign({ username: data.username, email: data.email, id: data.id, role: data.role }, jwtSecret, { expiresIn: '7d' })
    return { data, token }
  }

  async signup (userData) {
    if (await this.users.getByFilter({ email: userData.email })) {
      return { fail: true, message: 'Ese email ya está en uso.' }
    } else if (await this.users.getByFilter({ username: userData.username })) {
      return { fail: true, message: 'Ese nombre de usuario ya está en uso.' }
    }

    const salt = await bcrypt.genSalt(10)
    userData.role = 1
    userData.password = await bcrypt.hash(userData.password, salt)

    const user = await this.users.create(userData)
    if (user.fail) return user

    await sendEmail(
      user.email,
      'Registro exitoso',
      'Registro exitoso',
      `<h1>¡Gracias ${user.username} por unirte a nuestro equipo!</h1>`
    )

    return this.getToken(user)
  }

  async login (email, password) {
    if (!email || !password) return { fail: true, message: 'Ingresa ambas credenciales.' }

    const user = await this.users.getByFilter({ email })

    if (user) {
      const realPassword = await bcrypt.compare(password, user.password)
      if (realPassword) return this.getToken(user)
      else return { fail: true, message: 'Las credenciales no coinciden.' }
    } else return { fail: true, message: 'El usuario no existe.' }
  }

  async validateUser (data) {
    const user = await this.users.getByFilter({ email: data.email })
    return this.getToken(user)
  }
}

module.exports = Auth
