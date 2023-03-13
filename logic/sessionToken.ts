import { v4 as uuidv4 } from 'uuid'
import { createHmac } from 'node:crypto'
const SECRET = '6G7Mbux!P0__483h!nhsdfbghuDg23mHi'

export function createSessionToken() {
  const uuid = uuidv4()
  const hash = createHmac('sha256', SECRET).update(uuid).digest('hex')

  return hash
}

/**
 * Hash session token to prevent crafting a session token by attacker
 */
function hashSessionToken(sessionToken: string) {
  
}

