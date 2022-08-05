#!/usr/local/bin/node
const { join } = require('path')
require('dotenv').config({ path: join(__dirname, '../.env') })

const { Command } = require('commander')
const { orderLog } = require('./handlers/log')

const program = new Command()

program
  .command('mail', 'Interact with mail', { executableFile: 'mail.js' })
  .command('subscriptions', 'Interact with subscriptions', {
    executableFile: 'subscriptions.js',
  })
  .alias('subs')
  .executableDir(join(__dirname, './commands'))
program.command('order_log').action(orderLog)
program.parse(process.argv)
