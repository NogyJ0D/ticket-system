const { mongoose } = require('../config/database')
const mongoosePaginate = require('mongoose-paginate-v2')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Ingresa tu nombre.'],
    unique: true
  },

  email: {
    type: String,
    required: [true, 'Ingresa tu email.'],
    unique: true,
    lowercase: true
  },

  firstname: {
    type: String,
    required: [true, 'Ingresa tu nombre.']
  },

  lastname: {
    type: String,
    required: [true, 'Ingresa tu apellido.']
  },

  role: {
    type: Number,
    enum: [[1, 2], 'Tu rol debe ser 1 o 2.']
  },

  password: String

}, { timestamps: true })
userSchema.plugin(mongoosePaginate)
userSchema.plugin(uniqueValidator)

const UserModel = mongoose.model('users', userSchema)
module.exports = UserModel
