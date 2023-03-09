const { MongoClient } = require('mongodb')

interface User {
  login: string
  password: string
  _id: null | string
}

export async function createUser(login: string, password: string) {
  const { db, client } = getDb()
  const users = db.collection('users')

  const newUser: User = {
    login,
    password,
    _id: null
  }

  let insertResult
  try {
    insertResult = await users.insertOne(newUser)
  } finally {
    await client.close()
  }

  console.log(`A document was inserted with the _id: ${insertResult.insertedId}`)

  newUser._id = String(insertResult.insertedId)

  return newUser
}

export async function getUser(login: string, password: string) {
  const { db, client } = getDb()
  const users = db.collection('users')

  let user
  try {
    user = await users.findOne({login, password})
  } finally {
    await client.close();
  }

  return user
}

function getDb() {
  const uri = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(uri, {connectTimeoutMS: 1000, serverSelectionTimeoutMS: 1000, socketTimeoutMS: 1000}) // TODO: ofc change to different timeout when prod or just omit it
  const db = client.db('sntm')

  return {db, client}
}