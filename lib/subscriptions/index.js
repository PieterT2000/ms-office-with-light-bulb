const TeamsSubscription = require('./TeamsSubscription')
const WhatsAppSubscription = require('./whatsapp')
const EmailSubscription = require('./EmailSubscription')
const { getClient } = require('../../graphHelper')

async function getSubscriptions() {
  const userClient = getClient()
  const { value: subscriptions } = await userClient.api('/subscriptions').get()
  return subscriptions
}
async function deleteAllSubscriptions() {
  const userClient = getClient()
  const subscriptions = await getSubscriptions()

  // eslint-disable-next-line no-restricted-syntax
  for (const subscription of subscriptions) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await userClient.api(`/subscriptions/${subscription.id}`).delete()
    } catch (error) {
      const errorObj = JSON.parse(error.body)
      console.log(errorObj.code, ' - ', errorObj.message)
      console.log('Subscription ', subscription.id)
    }
  }
}

module.exports = {
  TeamsSubscription,
  WhatsAppSubscription,
  EmailSubscription,
  deleteAllSubscriptions,
  getSubscriptions,
}
