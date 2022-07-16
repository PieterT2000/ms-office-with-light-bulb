require('dotenv').config()
require('./server')
const graphHelper = require('./graphHelper')
const subscriptions = require('./subscriptions')

function initialize() {
  console.log('Initializing...')
  graphHelper.initialiseGraphForUserAuth(info => {
    console.log(info.message)
  })
}

function initializeSubscriptions() {
  console.log('Initializing subscriptions...')
  subscriptions.EmailSubscription.initialize(
    graphHelper.getClient(),
    `${process.env.ENDPOINT}/email`
  )
}

async function displayUserInfo() {
  try {
    const user = await graphHelper.getUserInfo()
    console.log(`Hello, ${user.displayName}!`)
    console.log(`Email: ${user.mail}`)
  } catch (error) {
    console.log(`Error getting user: ${error}`)
  }
}

async function main() {
  initialize()
  // const token = await graphHelper.getUserToken()
  displayUserInfo()
  initializeSubscriptions()
}
main()
