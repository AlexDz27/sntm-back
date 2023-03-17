import { Request } from 'express'
import { deviceDetector } from '../app'
import { AppError } from './appAndHttp'
import { hashPassword } from './auth'
import { DATABASE_CONNECTION_ERROR_USER_MESSAGE } from './constants'
import { getSixtyDaysFromToday } from './date'
import { createSessionToken } from './sessionToken'

const { MongoClient } = require('mongodb')

interface User {
  login: string
  password: string
  _id: null | string
}

export async function createUserAndToken(login: string, password: string, req: Request) {
  // Create new user and new session token in db
  const { db, client } = getDbAndClient()
  const users = db.collection('users')
  const sessionTokens = db.collection('sessionTokens')

  let hashedPassword = await hashPassword(password)
  const newUser: User = {
    login,
    password: hashedPassword,
    _id: null
  }
  const newSessionToken = {
    value: createSessionToken(),
    userId: null,
    ipAddress: req.socket.remoteAddress,
    device: deviceDetector.detect(req.get('User-Agent') as string),
    createdAt: new Date(),
    expiresAt: getSixtyDaysFromToday()
  }

  try {
    const insertResultNewUser = await users.insertOne(newUser)

    newSessionToken.userId = insertResultNewUser.insertedId
    const insertResultNewSessionToken = await sessionTokens.insertOne(newSessionToken)

    console.log(`A new user was inserted with the _id: ${insertResultNewUser.insertedId}`)
    console.log(`A new session token was inserted with the _id: ${insertResultNewSessionToken.insertedId}`)

    newUser._id = String(insertResultNewUser.insertedId)

    return {user: newUser, sessionToken: newSessionToken.value}
  } catch (err) {
    throw new AppError(err, DATABASE_CONNECTION_ERROR_USER_MESSAGE)
  } finally {
    await client.close()
  }
}

export async function getUserByLogin(login: string) {
  const { db, client } = getDbAndClient()
  const users = db.collection('users')

  try {
    const user = await users.findOne({login})
    return user
  } catch (err) {
    throw new AppError(err, DATABASE_CONNECTION_ERROR_USER_MESSAGE, 'qwe Message')
  } finally {
    await client.close();
  }
}

export async function getUserByToken(token: string) {
  const { db, client } = getDbAndClient()
  const sessionTokens = db.collection('sessionTokens')
  const users = db.collection('users')

  try {
    const sessionTokenRecord = await sessionTokens.findOne({value: token})
    const user = await users.findOne({_id: sessionTokenRecord?.userId})
    return user
  } finally {
    await client.close();
  }
}

export function getDbAndClient() {
  const uri = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(uri, {connectTimeoutMS: 1000, serverSelectionTimeoutMS: 1000, socketTimeoutMS: 1000}) // TODO: ofc change to different timeout when prod or just omit it
  const db = client.db('sntm')

  return {db, client}
}