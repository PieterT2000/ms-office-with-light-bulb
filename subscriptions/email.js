const { Client } = require('@microsoft/microsoft-graph-client')
const { addHours } = require('../util')

const hoursToMiliSecondsFactor = 1000 * 60 * 60

class EmailSubscription {
  /**
   * @type {Client | undefined}
   */
  userClient

  notificationUrl

  async renewSubscription(subscriptionId) {
    if (!this.userClient) {
      throw new Error('User client is required')
    }

    const subscription = {
      expirationDateTime: addHours.call(new Date(), 7).toISOString(),
    }

    const response = await this.userClient
      .api(`/subscriptions/${subscriptionId}`)
      .update(subscription)
    return response
  }

  static async initialize(userClient, notificationUrl) {
    this.userClient = userClient
    this.notificationUrl = notificationUrl

    /**
     * @type {Date}
     */
    const expiryDate = addHours.call(new Date(), 7).toISOString()

    const subscription = {
      changeType: 'created',
      notificationUrl: this.notificationUrl,
      resource: "me/mailFolders('Inbox')/messages",
      expirationDateTime: expiryDate,
      clientState: 'emailSubscription',
      latestSupportedTlsVersion: 'v1_2',
    }

    const response = await this.userClient
      .api('/subscriptions')
      .post(subscription)

    this.timeout = setTimeout(() => {
      this.renewSubscription(response.id)
    }, 6 * hoursToMiliSecondsFactor)
    return response
  }
}

module.exports = EmailSubscription
