import * as argon2 from 'argon2'
import { Request } from 'express'
import { AppError } from './appAndHttp'
import { ARGON2_ERROR_MESSAGE, GENERIC_SERVER_ERROR_USER_MESSAGE } from '../constants'
import { getDbAndClient, getUserByLogin } from './db'
import { createSessionToken } from './sessionToken'
import { deviceDetector } from '../app'
import { getSixtyDaysFromToday } from './date'

/**
 * @throws {object} Errors object
 */
export async function getLoggedInUserAndSession(
  login: null | undefined | string,
  password: null | undefined | string,
  req: Request
) {
  const errors: {login: any[], password: any[]} = {login: [], password: []}
  // Check if login and password are filled
  if (!login) errors.login.push('Логин должен быть заполнен')
  if (!password) errors.password.push('Пароль должен быть заполнен')
  if (errors.login.length > 0 || errors.password.length > 0) {
    console.error({login, password, errors})
    throw errors
  }
  password = password as string
  login = login as string

  // Verify password
  // // Get user by login. If not found, send error 'no user with such login/password'
  const userTryingLogin = await getUserByLogin(login)
  if (!userTryingLogin) {
    errors.password.push('Извините, но пользователя с таким логином и/или паролем не существует')
    throw errors
  }
  // // Actually verify hashed password. If no match, send error 'no user with such login/password'
  try {
    if (!await argon2.verify(userTryingLogin.password, password)) {
      errors.password.push('Извините, но пользователя с таким логином и/или паролем не существует')
    }
  } catch (err) {
    throw new AppError(err, GENERIC_SERVER_ERROR_USER_MESSAGE, ARGON2_ERROR_MESSAGE)
  }
  if (errors.password.length > 0) throw errors

  // All good, user does exist! Now create new session token for them and return user with their session token
  const { db, client } = getDbAndClient()
  const sessionTokens = db.collection('sessionTokens')
  const newSessionToken = {
    value: createSessionToken(),
    userId: userTryingLogin._id,
    ipAddress: req.socket.remoteAddress,
    device: deviceDetector.detect(req.get('User-Agent') as string),
    createdAt: String(new Date()),
    expiresAt: String(getSixtyDaysFromToday())
  }

  let insertResultNewSessionToken
  try {
    insertResultNewSessionToken = await sessionTokens.insertOne(newSessionToken)
  } finally {
    await client.close()
  }
  console.log(`A new session token was inserted with the _id: ${insertResultNewSessionToken.insertedId}`)

  const loggedInUser = userTryingLogin
  return {loggedInUser, sessionToken: newSessionToken}
}

export async function userAlreadyExists(login: string) {
  const userTryingLogin = await getUserByLogin(login)

  if (userTryingLogin) return true
  return false
}

export function areLoginAndPasswordCorrectFormat(
  login: null | undefined | string,
  password: null | undefined | string
): boolean {
  if (!login) return false
  if (!password) return false
  if (typeof login === 'string' && login?.length < 2) return false
  if (password && !isPasswordStrong(password)) return false

  return true
}
export function getLoginAndPasswordFormatErrors(
  login: null | undefined | string,
  password: null | undefined | string
): {login: any[], password: any[]} {
  const errors: {login: any[], password: any[]} = {login: [], password: []}
  if (!login) errors.login.push('Логин должен быть заполнен')
  if (!password) errors.password.push('Пароль должен быть заполнен')
  if (typeof login === 'string' && login?.length < 2) {
    errors.login.push('Логин должен быть больше двух символов')
  }
  if (password && !isPasswordStrong(password)) {
    errors.password.push('Пароль должен содержать минимум 8 английских букв, хотя бы одну большую букву, хотя бы один из символов (+!@#$%^&*_-) и хотя бы одну цифру')
  }

  return errors
}

export async function hashPassword(plainPassword: string) {
  let hash
  try {
    hash = await argon2.hash(plainPassword)
  } catch (err) {
    throw new AppError(err, GENERIC_SERVER_ERROR_USER_MESSAGE, ARGON2_ERROR_MESSAGE)
  }

  return hash
}

function isPasswordStrong(password: string): boolean {
  const regexp = /^(?=.*\d)(?=.*[+!@#$%^&*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return regexp.test(password)
}