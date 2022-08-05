const fs = require('fs')
const { join } = require('path')

function orderLog() {
  fs.readFile(join(__dirname, './../../log.json'), (err, data) => {
    const logs = JSON.parse(data)
    // create dict with etag as key and array of logs as value
    const groupedLogs = logs.reduce((acc, curr) => {
      const groupSelector = curr.etag
      if (!acc[groupSelector]) {
        acc[groupSelector] = []
      }

      // Only select interesting fields
      const newLog = {
        id: curr.id,
        etag: curr.etag,
        chatId: curr.chatId,
        messageType: curr.messageType,
        from: curr.from?.user?.displayName || curr.from,
        created: curr.createdDateTime || curr.created,
        lastModified: curr.lastModifiedDateTime || curr.lastModified,
        lastEdited: curr.lastEditedDateTime || curr.lastEdited,
        msg: curr.body?.content || curr.msg,
      }
      acc[groupSelector].push(newLog)
      return acc
    }, {})
    // convert dict to array and flatten out
    const orderedLogs = Object.values(groupedLogs).reduce(
      (acc, curr) => acc.concat(curr),
      []
    )
    fs.writeFileSync(
      join(__dirname, './../../log.json'),
      JSON.stringify(orderedLogs)
    )
  })
}

module.exports = {
  orderLog,
}
