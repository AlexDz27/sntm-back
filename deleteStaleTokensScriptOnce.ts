import { getDbAndClient } from "./logic/db"

const current = new Date();

(async () => {
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

  console.log('Deleted some sess tokens')
})()