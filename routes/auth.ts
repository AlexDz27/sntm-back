const express = require('express')
const router = express.Router()
const { verifyLoginAndPassword } = require('../logic/auth')
const { createUser } = require('../logic/db')
import { sendResponse } from "../logic/http"
import { NextFunction as Next, Request, Response } from 'express'

router.post('/register', async function(req: Request, res: Response, next: Next) {
  // Verify login and password
  const login = req.body.login?.trim()
  const password = req.body.password
  try {
    verifyLoginAndPassword(login, password)
  } catch (errors) {
    return sendResponse(res, {status: 'error', userMessage: {errors}})
  }

  // Create user in database
  let newUser
  try {
    newUser = await createUser(login, password)
  } catch (err) {
    console.error(err)
    return sendResponse(res, {status: 'error', userMessage: 'Извините, мы не смогли подключиться к нашей базе данных', message: err})
  }

  // Send response with session token
  return sendResponse(res, {status: 'ok', userMessage: 'Регистрация прошла успешно ✔', message: 'Регистрация успешна', user: newUser})
})

module.exports = router
export {}