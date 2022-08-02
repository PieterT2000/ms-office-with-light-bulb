const express = require('express')
const { createServer } = require('http')
const fs = require('fs')
const { join } = require('path')
const {
  isTokenValid,
  decryptResourceData,
} = require('./auth/change_notifications/index')
const { blinkLight, blue, purple } = require('./lightbulb')
const db = require('./lib/db')

function logToJsonFile(logging) {
  fs.readFile(join(__dirname, 'log.json'), (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    const log = JSON.parse(data)
    log.push(logging)
    fs.writeFile(join(__dirname, 'log.json'), JSON.stringify(log), err => {
      if (err) {
        console.log(err)
      }
    })
  })
}

const app = express()
app.use(express.json())
const server = createServer(app)

const port = process.env.PORT

server.listen(port)

app.get('/', (req, res) => {
  res.send('Ok')
})

app.post('/', async (req, res) => {
  const token = req.query.validationToken
  if (token) {
    return res.send(token)
  }

  res.status(200) // change notification accepted

  const { body } = req
  const notificationType = body.value[0].clientState
  if (notificationType === 'EmailSubscription') {
    console.log('emailObject ', body.value[0])
    // TODO: Handle superfluous triggers
    blinkLight(4000, blue)
  } else if (notificationType === 'TeamsSubscription') {
    const valid = await isTokenValid(body.validationTokens[0])
    if (valid) {
      const data = decryptResourceData(body.value[0].encryptedContent)
      const resourceData = JSON.parse(data)
      if (data && !db.has(resourceData.etag)) {
        logToJsonFile(resourceData)
        blinkLight(4000, purple)
        db.set(resourceData.etag, true)
        db.save()
      }
    }
  }
})

console.log(`Server running on port ${port}`)
