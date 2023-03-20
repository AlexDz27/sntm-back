import { v4 as uuidv4 } from 'uuid'
import { createHmac } from 'node:crypto'
import { SESSION_TOKEN_HASH_SECRET } from '../env'

export function createSessionToken() {
  const uuid = uuidv4()
  // Also hash GUID to prevent crafting a session token by attacker
  const hash = createHmac('sha256', SESSION_TOKEN_HASH_SECRET).update(uuid).digest('hex')

  const sessionToken = hash
  return sessionToken
}