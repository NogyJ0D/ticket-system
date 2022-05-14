const TicketModel = require('../models/ticket')
const sendEmail = require('../libs/email')

class Tickets {
  validate (error) {
    // console.log(error)
    const errorMessages = Object.keys(error.errors).map(e => {
      const err = error.errors[e]
      return err.properties.message
    })
    return { fail: true, message: errorMessages }
  }

  async getAll (limit, page) {
    limit || (limit = 20)
    page || (page = 1)
    const tickets = await TicketModel.paginate({}, { limit, page })
    tickets.filter = 'none'
    return tickets
  }

  async getById (id) {
    if (!id) return { fail: true, message: 'Introduce el id del ticket.' }

    const ticket = await TicketModel.findById(id).populate('viewed.by closed.by', 'username')
    if (!ticket) return { fail: true, message: 'No existe un ticket con ese id.' }

    return ticket
  }

  async getByFilter (filter, param, limit, page) {
    limit || (limit = 20)
    page || (page = 1)
    const tickets = await TicketModel.paginate({ [filter]: param }, { limit, page })
    tickets.filter = filter
    tickets.param = param
    return tickets
  }

  async create (data) {
    if (!data) return { fail: true, message: 'Ingresa la información.' } // Data = { username, email, text }

    const newTicket = new TicketModel(data)
    const validation = newTicket.validateSync()
    if (validation) return this.validate(validation)

    await sendEmail(
      data.email,
      'Ticket creado con éxito',
      'Tu problema será resuelto a la brevedad.',
      `<h1>${data.username}, tu problema será resuelto a la brevedad.</h1>
      <br>
      <h2>Una copia de tu ticket:</h2>
      </br>
      <h3>${data.title}</h3>
      <p>${data.text}</p>
      <p>Número de ticket: ${data.ticketNumber}`
    )

    await newTicket.save()
    return { success: true, message: 'Ticket creado con éxito.', newTicket }
  }

  async markViewed (id, userId) {
    if (!id) return { fail: true, message: 'Introduce el id del ticket.' }

    const ticket = await TicketModel.findById(id)
    if (!ticket) return { fail: true, message: 'No existe un ticket con ese id.' }
    else if (ticket.viewed.status) return { fail: true, message: 'Ese ticket ya fue marcado como visto.' }

    ticket.viewed = {
      status: true,
      by: userId,
      on: Date.now()
    }
    await ticket.save()

    await sendEmail(
      ticket.email,
      'Ticket visto',
      'Tu problema ya está siendo estudiado.',
      `<h1>${ticket.username}, tu ticket está siendo revisado por un técnico.</h1>
      <br>
      <h2>Una copia de tu ticket:</h2>
      </br>
      <h3>${ticket.title}</h3>
      <p>${ticket.text}</p>
      <p>Número de ticket: ${ticket.ticketNumber}`
    )

    return { success: true, message: 'Ticket visto con éxito.', ticket }
  }

  async markClosed (id, data) {
    if (!id) return { fail: true, message: 'Introduce el id del ticket.' }

    const ticket = await TicketModel.findById(id).populate('closed.by', 'username')
    if (!ticket) return { fail: true, message: 'No existe un ticket con ese id.' }
    else if (ticket.closed.status) return { fail: true, message: 'Ese ticket ya fue marcado como cerrado.' }
    else if (!ticket.viewed.status) return { fail: true, message: 'El ticket debe ser marcado primero como visto.' }

    ticket.closed = {
      status: true,
      by: data.userId,
      on: Date.now(),
      summary: data.summary
    }

    await sendEmail(
      ticket.email,
      'Ticket cerrado',
      'Tu problema ya fue solucionado.',
        `<h1>${ticket.username}, tu ticket ya está cerrado y te enviamos la respuesta del técnico.</h1>
        <br>
        <h2>Una copia de tu ticket:</h2>
        </br>
        <h3>${ticket.title}</h3>
        <p>${ticket.text}</p>
        <p>Número de ticket: ${ticket.ticketNumber}</p>
        <br>
        <h2>Respuesta a tu problema:</h2>
        </br>
        <h3>Cerrado por: ${ticket.closed.by.username}</h3>
        <p>${ticket.closed.summary}</p>`
    )

    return { success: true, message: 'Ticket cerrado con éxito.', ticket }
  }
}

module.exports = Tickets
