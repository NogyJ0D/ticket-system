const sgMail = require('@sendgrid/mail')
const { emailApiKey } = require('../config')
sgMail.setApiKey(emailApiKey)

const sendEmail = async (to, subject, text, html) => {
  await sgMail.send({
    to,
    subject,
    text,
    html,
    from: 'valentingiarra2@gmail.com'
  })
  console.log('Email sent')
  return { success: true }
}

module.exports = sendEmail
