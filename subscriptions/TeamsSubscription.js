const { Client } = require('@microsoft/microsoft-graph-client') // eslint-disable-line
const { addMinutes, minutesToMiliSecondsFactor } = require('../util')
const Subscription = require('./subscription')
const { getUserInfo } = require('../graphHelper')

/**
 * Creates a MS Teams Subscription object.
 * @param {Client} userClient
 */
function TeamsSubscription(userClient) {
  return {
    /**
     * Registers the MS Teams Subscription.
     * @param {string} notificationUrl
     * @returns {Promise<any>}
     */
    async register(notificationUrl) {
      /**
       * @type {Date}
       */
      const expiryDate = addMinutes.call(new Date(), 60).toISOString()

      const { id } = await getUserInfo()

      const subscription = {
        changeType: 'created,updated',
        notificationUrl,
        resource: `/users/${id}/chats/getAllMessages`,
        expirationDateTime: expiryDate,
        clientState: 'TeamsSubscription',
      }

      const response = await Subscription(userClient).registerSubscription(
        subscription,
        55 * minutesToMiliSecondsFactor
      )

      return response
    },
  }
}

module.exports = TeamsSubscription
