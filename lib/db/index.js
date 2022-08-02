const fs = require('fs')
const { join } = require('path')

const DB_FILE_PATH = join(__dirname, './db.json')

class DB {
  constructor(db) {
    this.db = db
  }

  get(key) {
    return this.db[key]
  }

  has(key) {
    return !!this.db[key]
  }

  set(key, value) {
    this.db[key] = value
  }

  del(key) {
    delete this.db[key]
  }

  clear() {
    this.db = {}
    this.save()
  }

  save() {
    fs.writeFile(DB_FILE_PATH, JSON.stringify(this.db), null, err => {
      if (err) {
        console.log('database save error: ', err)
      }
    })
  }
}

const fileData = fs.readFileSync(DB_FILE_PATH)
const db = new DB(JSON.parse(fileData))

module.exports = db
