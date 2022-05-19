const { mongoose } = require('../config/database')

const chatSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Types.ObjectId,
    ref: 'tickets',
    required: true
  },

  sender: {
    type: String,
    required: true
  },

  senderRole: {
    type: String,
    enum: ['user', 'technician'],
    required: true
  },

  message: {
    type: String,
    required: true
  }
}, { timestamps: { createdAt: true, updatedAt: false } })

const ChatModel = mongoose.model('chats', chatSchema)
module.exports = ChatModel
