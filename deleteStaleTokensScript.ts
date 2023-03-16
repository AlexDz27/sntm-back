import { getDbAndClient } from './logic/db'

const current = new Date()
let lastMinutes = current.getMinutes()

setInterval(async () => {
  const current = new Date()
  const currentMinutes = current.getMinutes()

  if (lastMinutes !== currentMinutes) {
    const { db, client } = getDbAndClient()
    const sessionTokens = db.collection('sessionTokens')

    let deleteManyResult
    // currentDate > expiresAt -- засунуть это в фильтр
    try {
      deleteManyResult = await sessionTokens.deleteMany({expiresAt: {$lt: current}}) // TODO: proper with dates
    } finally {
      await client.close()
    }
    console.log('Deleted ' + deleteManyResult.deletedCount + ' session tokens')

    lastMinutes = currentMinutes
    console.log('ran command! Now lastMinutes is ' + lastMinutes)
  }
}, 3000) // run this code every hour (3600000) TODO: change to brackets

/*
TODO:
1. actually do delete, test
2. change to day

errors? how to handle?

// could be problems with await inside setInterval?
*/