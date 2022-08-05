const { google } = require('googleapis')
const { authorize } = require('../../auth/gmail/gmail')

async function sendMail(auth, to, subject = '', body = '') {
  const gmail = google.gmail({ version: 'v1', auth })
  const { GMAIL_USER_ID: sender } = process.env
  const messageParts = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `From: ${sender}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body,
  ]
  const message = messageParts.join('\n')

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return gmail.users.messages.send({
    userId: sender,
    requestBody: {
      raw: encodedMessage,
    },
  })
}

module.exports = {
  sendMail: (...args) => authorize(auth => sendMail(auth, ...args)),
}
