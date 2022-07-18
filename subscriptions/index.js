const TeamsSubscription = require('./TeamsSubscription')
const WhatsAppSubscription = require('./whatsapp')
const EmailSubscription = require('./EmailSubscription')
const { getClient } = require('../graphHelper')

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
    // eslint-disable-next-line no-await-in-loop
    await userClient.api(`/subscriptions/${subscription.id}`).delete()
  }
}

module.exports = {
  TeamsSubscription,
  WhatsAppSubscription,
  EmailSubscription,
  deleteAllSubscriptions,
  getSubscriptions,
}
