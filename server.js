const express = require('express')
const { createServer } = require('http')
const { blinkLight, blue, purple } = require('./lightbulb')

const app = express()
app.use(express.json())
const server = createServer(app)

const port = process.env.PORT

server.listen(port)

app.get('/', (req, res) => {
  res.send('Ok')
})

app.post('/', (req, res) => {
  const token = req.query.validationToken
  if (token) return res.send(token)

  const notificationType = req.body.value[0].clientState
  if (notificationType === 'EmailSubscription') {
    // TODO: Handle superfluous triggers
    blinkLight(4000, blue)
  } else if (notificationType === 'TeamsSubscription') {
    blinkLight(4000, purple)
  }
  res.status(200)
})

console.log(`Server running on port ${port}`)
