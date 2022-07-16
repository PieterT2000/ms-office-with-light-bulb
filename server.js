const express = require('express')
const { createServer } = require('http')
const { blinkLight, blue } = require('./lightbulb')

const app = express()
app.use(express.json())
const server = createServer(app)

const port = process.env.PORT

server.listen(port)

app.get('/', (req, res) => {
  res.send('Ok')
})

app.post('/email', (req, res) => {
  const token = req.query.validationToken
  if (token) res.send(token)
  else if (req.body.value[0].clientState === 'emailSubscription') {
    // TODO: Handle superfluous triggers
    console.log()
    blinkLight(4000, blue)
    res.status(200)
  }
})

console.log(`Server running on port ${port}`)
