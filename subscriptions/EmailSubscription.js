const { Client } = require('@microsoft/microsoft-graph-client') // eslint-disable-line
const { addHours, minutesToMiliSecondsFactor } = require('../util')
const Subscription = require('./Subscription')

/**
 * @class EmailSubscription
 * @extends Subscription
 */
class EmailSubscription {
  /**
   * Creates a subscription for changes to email messages.
   * @param {Client} userClient
   * @param {string} notificationUrl
   * @returns
   */
  static async initialize(userClient, notificationUrl) {
    /**
     * @type {Date}
     */
    const expiryDate = addHours.call(new Date(), 7).toISOString()

    const subscription = {
      changeType: 'created',
      notificationUrl,
      resource: "me/mailFolders('Inbox')/messages",
      expirationDateTime: expiryDate,
      clientState: 'EmailSubscription',
      latestSupportedTlsVersion: 'v1_2',
    }

    return Subscription(userClient).registerSubscription(
      subscription,
      360 * minutesToMiliSecondsFactor // renew every 6 hours
    )
  }
}

module.exports = EmailSubscription
