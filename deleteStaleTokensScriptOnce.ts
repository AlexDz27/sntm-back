import { getDbAndClient } from "./logic/db"

(async () => {

})()
const current = new Date()
const currentMinutes = current.getMinutes()

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

console.log('ran command! Now lastMinutes is ' + lastMinutes)