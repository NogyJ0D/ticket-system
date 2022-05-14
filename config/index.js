require('dotenv').config()

const config = {
  PORT: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  // Mongoose
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  // Sendgrid
  emailApiKey: process.env.EMAIL_API_KEY
}

module.exports = config
