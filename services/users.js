const UserModel = require('../models/user')

class Users {
  validate (error) {
    const errorMessages = Object.keys(error.errors).map(e => {
      const err = error.errors[e]
      if (err.kind === 'unique') console.log(err)
      return err.properties.message
    })
    return { fail: true, message: errorMessages }
  }

  async getAll () {
    const users = await UserModel.find()
    users.forEach(user => { user.password = null })
    return users
  }

  getByFilter (filter) {
    return UserModel.findOne(filter)
  }

  async create (data) {
    const user = new UserModel(data)

    const validation = user.validateSync()
    if (validation) return this.validate(validation)

    return await user.save()
  }
}

module.exports = Users
