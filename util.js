/**
 * Should only be called using apply, call, or bind with **this** set to a valid Date instance
 * @param {number} h
 * @returns {Date | undefined}
 */
function addHours(h) {
  if (this instanceof Date) {
    this.setHours(this.getHours() + h)
    return this
  }
  return undefined
}

/**
 * Should only be called using apply, call, or bind with **this** set to a valid Date instance
 * @param {number} h
 * @returns {Date | undefined}
 */
function addMinutes(m) {
  if (this instanceof Date) {
    this.setMinutes(this.getMinutes() + m)
    return this
  }
  return undefined
}

const hoursToMiliSecondsFactor = 1000 * 60 * 60
const minutesToMiliSecondsFactor = 1000 * 60

module.exports = {
  addHours,
  addMinutes,
  hoursToMiliSecondsFactor,
  minutesToMiliSecondsFactor,
}
