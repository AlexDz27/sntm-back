import { Request } from 'express'
import { deviceDetector } from '../app'
import { hashPassword } from './auth'
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
    createdAt: String(new Date()),
    expiresAt: String(getSixtyDaysFromToday())
  }

  let insertResultNewUser
  let insertResultNewSessionToken
  try {
    insertResultNewUser = await users.insertOne(newUser)

    newSessionToken.userId = insertResultNewUser.insertedId
    insertResultNewSessionToken = await sessionTokens.insertOne(newSessionToken)
  } finally {
    await client.close()
  }
  console.log(`A new user was inserted with the _id: ${insertResultNewUser.insertedId}`)
  console.log(`A new session token was inserted with the _id: ${insertResultNewSessionToken.insertedId}`)

  newUser._id = String(insertResultNewUser.insertedId)

  return {user: newUser, sessionToken: newSessionToken.value}
}

export async function getUser(login: string) {
  const { db, client } = getDbAndClient()
  const users = db.collection('users')

  let user
  try {
    user = await users.findOne({login})
  } finally {
    await client.close();
  }

  return user
}

export function getDbAndClient() {
  const uri = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(uri, {connectTimeoutMS: 1000, serverSelectionTimeoutMS: 1000, socketTimeoutMS: 1000}) // TODO: ofc change to different timeout when prod or just omit it
  const db = client.db('sntm')

  return {db, client}
}