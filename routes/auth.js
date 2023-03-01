const express = require('express')
const router = express.Router()
const { verifyLoginAndPassword } = require('../logic/auth')
const { createUser } = require('../logic/db')
const { AppResponse } = require('../logic/objects')

router.post('/register', async function(req, res, next) {
  // Verify login and password
  const login = req.body.login?.trim()
  const password = req.body.password
  try {
    verifyLoginAndPassword(login, password)
  } catch (errors) {
    return res.send(new AppResponse('error', {errors}))
  }

  // Create user in database
  let newUser
  try {
    newUser = await createUser(login, password)
  } catch (err) {
    console.error(err)
    return res.send(new AppResponse('error', 'Извините, мы не смогли подключиться к нашей базе данных', err.toString(), err))
  }

  // Send response with session token
  return res.send(new AppResponse('ok', 'Регистрация прошла успешно ✔', 'Регистрация успешна'))
  return res.send({status: 'ok', userMessage: 'Регистрация прошла успешно ✔', message: 'Регистрация успешна', user: newUser})
})

module.exports = router
