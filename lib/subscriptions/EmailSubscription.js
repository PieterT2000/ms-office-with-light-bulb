const { Client } = require('@microsoft/microsoft-graph-client') // eslint-disable-line
const { minutesToMiliSecondsFactor, addMinutes } = require('../../util')
const Subscription = require('./Subscription')

/**
 * Creates a Email Subscription object.
 * @param {Client} userClient
 */
function EmailSubscription(userClient) {
  return {
    /**
     * Registers the Outlook Email Subscription.
     * @param {string} notificationUrl
     * @returns {Promise<any>}
     */
    async register(notificationUrl) {
      /**
       * @type {Date}
       */
      const expiryDate = addMinutes.call(new Date(), 30).toISOString()

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
        30 * minutesToMiliSecondsFactor
      )
    },
  }
}

module.exports = EmailSubscription
