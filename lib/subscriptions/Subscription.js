const { Client } = require('@microsoft/microsoft-graph-client') // eslint-disable-line
const chalk = require('chalk')
const { addMinutes, minutesToMiliSecondsFactor } = require('../../util')

function findExistingSubsciption(list, subscription) {
  return list.find(i => i.resource === subscription.resource)
}

/**
 * Factory for creating a new Subscription object.
 * @param {Client} userClient
 */
function Subscription(userClient) {
  let timeoutId = null
  /**
   * @type {number} in miliseconds
   */
  let subscriptionRenewalRate

  return {
    /**
     *
     * @param {Object} subscription
     * @param {Number} renewalRate in miliseconds
     */
    async registerSubscription(subscription, renewalRate) {
      subscriptionRenewalRate = renewalRate

      const { value: subscriptions } = await userClient
        .api('/subscriptions')
        .get()

      const existingSubscription = findExistingSubsciption(
        subscriptions,
        subscription
      )
      if (existingSubscription) {
        this.renewSubscription(existingSubscription.id)
      } else {
        try {
          const response = await userClient
            .api('/subscriptions')
            .post(subscription)
          this.registerForRenewal(response.id)
        } catch (error) {
          console.log(
            chalk.red(`\n${subscription.clientState} could not be created.\n`)
          )
          console.log(JSON.parse(error.body).message)
        }
      }
    },

    /**
     * Registers a renewal timer for the subscription
     * @param {string} subscriptionId
     */
    registerForRenewal(subscriptionId) {
      timeoutId = setTimeout(() => {
        clearTimeout(timeoutId)
        this.renewSubscription(subscriptionId)
      }, subscriptionRenewalRate - 2 * minutesToMiliSecondsFactor) // renew 2 minutes before expiry
    },

    /**
     *
     * @param {string} subscriptionId
     * @returns {Response}
     */
    async renewSubscription(subscriptionId) {
      if (!userClient) {
        throw new Error('User client is required')
      }

      const newSubscriptionObj = {
        expirationDateTime: addMinutes
          .call(
            new Date(),
            subscriptionRenewalRate / minutesToMiliSecondsFactor
          )
          .toISOString(),
      }

      let response = null
      try {
        response = await userClient
          .api(`/subscriptions/${subscriptionId}`)
          .patch(newSubscriptionObj)

        this.registerForRenewal(response.id)
      } catch (error) {
        console.log(
          chalk.red(
            `\nSubscription ${subscriptionId} could not be renewed. ${error.code}\n`
          )
        )
        console.log(JSON.parse(error.body).message)
      }

      return response
    },
  }
}

module.exports = Subscription
