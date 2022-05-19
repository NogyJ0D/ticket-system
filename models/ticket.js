const { mongoose } = require('../config/database')
const mongoosePaginate = require('mongoose-paginate-v2')
const autoIncrement = require('mongoose-sequence')(mongoose)

const ticketSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Ingresa tu nombre.']
  },

  email: {
    type: String,
    required: [true, 'Ingresa tu email.']
  },

  title: {
    type: String,
    required: [true, 'Ingresa un título para el ticket.'],
    maxlength: [32, 'El título puede contener hasta 32 caracteres.']
  },

  text: {
    type: String,
    required: [true, 'Ingresa el texto del ticket.']
  },

  viewed: {
    status: {
      type: Boolean,
      default: false
    },

    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },

    on: Date
  },

  closed: {
    status: {
      type: Boolean,
      default: false
    },

    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },

    on: Date,

    summary: String
  },

  ticketNumber: Number,

  secretKey: {
    type: String,
    required: true,
    maxlength: 16
  }

}, { timestamps: true })
ticketSchema.plugin(mongoosePaginate)
ticketSchema.plugin(autoIncrement, { inc_field: 'ticketNumber' })

const TicketModel = mongoose.model('tickets', ticketSchema)
module.exports = TicketModel
