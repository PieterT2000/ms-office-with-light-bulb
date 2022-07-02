const TPLSmartDevice = require('tplink-lightbulb')

const light = new TPLSmartDevice(process.env.LIGHT_BULB_IP)

function blinkLight(duration) {
  if (!light) {
    throw new Error('Light is required')
  }
  light.power(true).then(status => {
    const timeout = setTimeout(() => {
      light.power(false)
      clearTimeout(timeout)
    }, duration)
  })
}

module.exports = {
  blinkLight,
}
