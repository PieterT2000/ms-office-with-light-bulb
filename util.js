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

module.exports = {
  addHours,
}
