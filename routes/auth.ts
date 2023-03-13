const express = require('express')
const router = express.Router()
import { NextFunction as Next, Request, Response } from 'express'
import { HTTP_BAD_CREDENTIALS, HTTP_BAD_REQUEST, HTTP_SERVER_ERROR } from '../logic/constants'
import { createUser } from '../logic/db'
import { checkLoginAndPasswordCorrectFormat, userAlreadyExists, getLoggedInUser } from '../logic/auth'
import { AppError, sendResponse } from '../logic/appAndHttp'

router.post('/register', async function(req: Request, res: Response, next: Next) {
  // Check if format of login and password is correct
  const login = req.body.login?.trim()
  const password = req.body.password
  try {
    checkLoginAndPasswordCorrectFormat(login, password)
  } catch (errors) {
    res.status(HTTP_BAD_REQUEST)
    return sendResponse(res, {status: 'error', userMessage: {errors}})
  }

  // Check if user already exists
  if (await userAlreadyExists(login)) {
    res.status(HTTP_BAD_CREDENTIALS)
    return sendResponse(res, {status: 'error', userMessage: `Извините, но пользователь с логином ${login} уже существует. Попробуйте использовать другой логин.`})
  }

  // All good! Create user in database
  let newUser
  try {
    newUser = await createUser(login, password, req)
  } catch (err) {
    console.error(err)
    res.status(HTTP_SERVER_ERROR)
    if (err instanceof AppError) {
      return sendResponse(res, {status: 'error', userMessage: err.userMessage, message: err.message})      
    }

    return sendResponse(res, {status: 'error', userMessage: 'Извините, мы не смогли подключиться к нашей базе данных', message: err})
  }

  // Send response with session token
  res.cookie('sessionToken', 'zxczxcxzzxcc')
  return sendResponse(res, {
    status: 'ok',
    userMessage: 'Регистрация прошла успешно ✔',
    message: 'Регистрация успешна',
    user: {login: newUser.user.login, _id: newUser.user._id},
  })
})

router.post('/login', async function(req: Request, res: Response, next: Next) {
  // Verify login and password
  const login = req.body.login?.trim()
  const password = req.body.password
  let loggedInUser
  try {
    loggedInUser = await getLoggedInUser(login, password)
  } catch (errors) {
    res.status(HTTP_BAD_CREDENTIALS)
    return sendResponse(res, {status: 'error', userMessage: {errors}})
  }

  // Login user, i.e. send response with session token
  // 2. Send them the response with the token and user details to further use it in frontend
  res.cookie('sessionToken', 'foooofofofofofof')
  return sendResponse(res, {
    status: 'ok',
    userMessage: 'Вы успешно залогинены ✔',
    message: 'Логин успешен',
    user: loggedInUser,
  })
})

module.exports = router
export {}