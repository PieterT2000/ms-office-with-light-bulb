require('dotenv').config()
require('./server')
const graphHelper = require('./graphHelper')

function initialize() {
  console.log('Initializing...')
  graphHelper.initialiseGraphForUserAuth(info => {
    console.log(info.message)
  })
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
}
main()
