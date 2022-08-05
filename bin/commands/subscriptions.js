const { Command } = require('commander')
const { initialiseGraphForUserAuth } = require('../../graphHelper')

initialiseGraphForUserAuth()
const {
  deleteAllSubscriptions,
  getSubscriptions,
} = require('../../lib/subscriptions/index')
const {
  hoursToMiliSecondsFactor,
  minutesToMiliSecondsFactor,
} = require('../../util')

function toLocaleTimeStr(str) {
  return new Date(str).toLocaleTimeString()
}

function timeDiffInHoursAndMins(d1, d2) {
  const diff = d1.getTime() - d2.getTime()
  const hours = Math.floor(diff / hoursToMiliSecondsFactor)
  const remainder = diff - hours * hoursToMiliSecondsFactor
  const mins = Math.floor(remainder / minutesToMiliSecondsFactor)
  return `${hours}h ${mins}m`
}

const subscriptions = new Command()
subscriptions
  .command('delete')
  .alias('del')
  .description('Delete all subscriptions')
  .action(deleteAllSubscriptions)
subscriptions
  .command('list')
  .alias('ls')
  .description('List all subscriptions')
  .action(async () => {
    const list = await getSubscriptions()
    console.log(
      list.map(s => ({
        id: s.id,
        resource: s.resource,
        expiry: toLocaleTimeStr(s.expirationDateTime),
        timeLeft: timeDiffInHoursAndMins(
          new Date(s.expirationDateTime),
          new Date()
        ),
      })),
      list.length
    )
  })

subscriptions.parse(process.argv)
