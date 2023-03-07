const { MongoClient } = require('mongodb')

interface User {
  login: string
  password: string
  _id: null | string
}

module.exports.createUser = async function(login: string, password: string) {
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

function getDb() {
  const uri = 'mongodb://localhost:27017'
  const client = new MongoClient(uri, {connectTimeoutMS: 1000, serverSelectionTimeoutMS: 1000, socketTimeoutMS: 1000}) // TODO: ofc change to different timeout when prod or just omit it
  const db = client.db('sntm')

  return {db, client}
}