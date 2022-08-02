const jwt = require('jsonwebtoken')
const jkwsClient = require('jwks-rsa')
const crypto = require('crypto')
const fs = require('fs')
const settings = require('../../appSettings')

const client = jkwsClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

function isTokenValid(token) {
  return new Promise(resolve => {
    const options = {
      audience: [settings.clientId],
      issuer: [`https://sts.windows.net/${settings.tenantId}/`],
    }
    jwt.verify(token, getKey, options, err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

function decryptResourceData(encryptedContent) {
  // decrypt Data key in encryptedContent.dataKey
  const base64EncodedKey = encryptedContent.dataKey
  const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_FILE_PATH)
  const dataKeyBuffer = Buffer.from(base64EncodedKey, 'base64')
  const decryptedSymetricKey = crypto.privateDecrypt(privateKey, dataKeyBuffer)

  // Create HMAC-SHA256 signature using encryptedContent.dataKey and encryptedContent.data
  const base64encodedSignature = encryptedContent.dataSignature
  const base64EncodedPayload = encryptedContent.data
  const hmac = crypto.createHmac('sha256', decryptedSymetricKey)
  hmac.write(base64EncodedPayload, 'base64')
  // Compare HMAC-SHA256 signature with encryptedContent.dataSignature
  if (base64encodedSignature === hmac.digest('base64')) {
    // Continue with decryption of the encryptedPayload.
    const iv = Buffer.alloc(16, 0) // initialization vector
    decryptedSymetricKey.copy(iv, 0, 0, 16)
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      decryptedSymetricKey,
      iv
    )
    let decryptedPayload = decipher.update(
      base64EncodedPayload,
      'base64',
      'utf8'
    )
    decryptedPayload += decipher.final('utf8')
    return decryptedPayload
  }
  // Do not attempt to decrypt encryptedPayload. Assume notification payload has been tampered with and investigate.
  return undefined
}

module.exports = {
  isTokenValid,
  decryptResourceData,
}
