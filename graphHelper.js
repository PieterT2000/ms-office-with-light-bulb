require('isomorphic-fetch')
const azure = require('@azure/identity')
const { cachePersistencePlugin } = require('@azure/identity-cache-persistence')
const graph = require('@microsoft/microsoft-graph-client')
const authProviders = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials')
const settings = require('./appSettings')

azure.useIdentityPlugin(cachePersistencePlugin)

// Important: Only when you actually call the api, will the token be lookedup/refreshed

/**
 * @type {graph.Client | undefined}
 */
let userClient

/**
 * @type {azure.DeviceCodeCredential| undefined}
 */
let deviceCodeCredential

function initialiseGraphForUserAuth(deviceCodePrompt) {
  if (!settings) {
    throw new Error('Settings are required')
  }

  deviceCodeCredential = new azure.DeviceCodeCredential({
    clientId: settings.clientId,
    tenantId: settings.tenantId,
    userPromptCallback: deviceCodePrompt,
    tokenCachePersistenceOptions: {
      enabled: true,
    },
  })

  // Returns access token for the user
  const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
    deviceCodeCredential,
    {
      scopes: settings.graphUserScopes,
    }
  )
  userClient = graph.Client.initWithMiddleware({
    authProvider,
    debugLogging: false,
  })
}

async function getUserToken() {
  if (!deviceCodeCredential) {
    throw new Error('Device code credential is required')
  }

  if (!settings.graphUserScopes) {
    throw new Error('Settings "Scopes" cannot be undefined')
  }

  const response = await deviceCodeCredential.getToken(settings.graphUserScopes)
  // reponse contains also info when token expires
  return response.token
}

async function getUserInfo() {
  if (!userClient) {
    throw new Error('User client is required')
  }

  const user = await userClient
    .api('/me')
    .select(['displayName', 'mail', 'id'])
    .get()
  return user
}

function getClient() {
  return userClient
}

module.exports = {
  initialiseGraphForUserAuth,
  getUserToken,
  getUserInfo,
  getClient,
}
