const TPLSmartDevice = require('tplink-lightbulb')

const light = new TPLSmartDevice(process.env.LIGHT_BULB_IP)

const blue = {
  hue: 200,
  saturation: 100,
  brightness: 100,
  color_temp: 0,
}

const purple = {
  hue: 280,
  saturation: 100,
  brightness: 100,
  color_temp: 0,
}

const green = {
  hue: 120,
  saturation: 100,
  brightness: 100,
  color_temp: 0,
}

function blinkLight(duration, color = green) {
  if (!light) {
    throw new Error('Light is required')
  }

  light.power(true, 0, color).then(status => {
    const timeout = setTimeout(() => {
      light.power(false)
      clearTimeout(timeout)
    }, duration)
  })
}

module.exports = {
  blinkLight,
  blue,
  green,
  purple,
}
