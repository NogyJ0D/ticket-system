const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { PORT } = require('./config')

const app = express()

const { connection } = require('./config/database')
connection()

const ticketsRoutes = require('./routes/tickets')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

app.use(express.json())
app.use(cookieParser())
app.use(cors())

ticketsRoutes(app)
authRoutes(app)
userRoutes(app)

app.listen(PORT, () => {
  console.log('Working on port:')
  console.log('http://localhost:' + PORT)
})

app.get('/', (req, res) => {
  res.send('Hello')
})
