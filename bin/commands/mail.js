const { Command } = require('commander')
const { sendMail } = require('../handlers/mail')

const mail = new Command()
mail
  .command('send')
  .description('Send a mail using Gmail API')
  .argument('<to>', 'The email address to send the mail to')
  .argument('<subject>', 'The subject of the mail')
  .argument('[body]', 'The body of the mail')
  .action(sendMail)

mail.parse(process.argv)
