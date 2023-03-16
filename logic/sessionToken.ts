import { v4 as uuidv4 } from 'uuid'
import { createHmac } from 'node:crypto'

export function createSessionToken() {
  const uuid = uuidv4()
  // Also hash GUID to prevent crafting a session token by attacker
  const hash = createHmac('sha256', process.env.SESSION_TOKEN_HASH_SECRET!).update(uuid).digest('hex')

  const sessionToken = hash
  return sessionToken
}