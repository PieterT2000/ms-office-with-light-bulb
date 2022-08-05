const fs = require('fs')
const path = require('path')
const { Client } = require('@microsoft/microsoft-graph-client') // eslint-disable-line
const { addMinutes, minutesToMiliSecondsFactor } = require('../../util')
const Subscription = require('./Subscription')
const { getUserInfo } = require('../../graphHelper')

const { PUBLIC_KEY_FILE_PATH } = process.env
const pubKeyString = fs.readFileSync(PUBLIC_KEY_FILE_PATH).toString('base64')
const certificateName = path.basename(PUBLIC_KEY_FILE_PATH)

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
      const expiryDate = addMinutes.call(new Date(), 5).toISOString()

      const { id } = await getUserInfo()

      const subscription = {
        changeType: 'created',
        notificationUrl,
        // lifecycleNotificationUrl: notificationUrl,
        resource: `/users/${id}/chats/getAllMessages`,
        includeResourceData: true,
        encryptionCertificate: pubKeyString,
        encryptionCertificateId: certificateName,
        expirationDateTime: expiryDate,
        clientState: 'TeamsSubscription',
      }

      const response = await Subscription(userClient).registerSubscription(
        subscription,
        5 * minutesToMiliSecondsFactor
      )

      return response
    },
  }
}

module.exports = TeamsSubscription
