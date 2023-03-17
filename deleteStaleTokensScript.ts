import { getDbAndClient } from './logic/db'

console.log('deleteStaleTokensScript in running...')

const current = new Date()
let lastMinutes = current.getMinutes()

setInterval(async () => {
  const current = new Date()
  const currentMinutes = current.getMinutes()

  if (lastMinutes !== currentMinutes) {
    const { db, client } = getDbAndClient()
    const sessionTokens = db.collection('sessionTokens')

    let deleteManyResult
    try {
      deleteManyResult = await sessionTokens.deleteMany({expiresAt: {$lt: current}})
    } catch (err) {
      console.log('WARNING: ERROR IN DELETING SESSION TOKENS SCRIPT')
      console.error(err)

      await client.close()
      return
    } finally {
      await client.close()
    }
    console.log('Deleted ' + deleteManyResult.deletedCount + ' session tokens')

    lastMinutes = currentMinutes
    console.log('Ran session tokens deletion command! Now lastMinutes is ' + lastMinutes)
  }
}, 3600000)