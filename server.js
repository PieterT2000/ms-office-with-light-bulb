const express = require('express')
const { createServer } = require('http')
const { subscribeToEmail } = require('./graphHelper')
const { blinkLight } = require('./lightbulb')

const app = express()
const server = createServer(app)

const port = process.env.PORT

server.listen(port)

app.get('/', (req, res) => {
  res.send('Ok')
})

app.post('', (req, res) => {
  const token = req.query.validationToken
  if (token) res.send(token)
  else {
    blinkLight(4000)
    res.status(200)
  }
})

app.get('/register', async (req, res) => {
  try {
    const msg = await subscribeToEmail(process.env.ENDPOINT)
    res.send(msg)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

console.log(`Server running on port ${port}`)
