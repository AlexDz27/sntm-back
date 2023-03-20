const express = require('express')
const router = express.Router()
import { NextFunction as Next, Request, Response } from 'express'
import { HTTP_BAD_CREDENTIALS, HTTP_BAD_REQUEST, HTTP_SERVER_ERROR } from '../logic/constants'
import { createUserAndToken } from '../logic/db'
import { checkLoginAndPasswordCorrectFormat, userAlreadyExists, getLoggedInUserAndSession } from '../logic/auth'
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
  try {
    if (await userAlreadyExists(login)) {
      res.status(HTTP_BAD_CREDENTIALS)
      return sendResponse(res, {status: 'error', userMessage: `Извините, но пользователь с логином ${login} уже существует. Попробуйте использовать другой логин.`})
    }
  } catch (error) {
    console.error(error)
    const err = error as AppError
    res.status(HTTP_SERVER_ERROR)
    return sendResponse(res, {status: 'error', userMessage: err.userMessage, message: err.message})
  }

  // All good! Create user in database
  let newUser
  try {
    newUser = await createUserAndToken(login, password, req)
  } catch (error) {
    console.error(error)
    const err = error as AppError
    res.status(HTTP_SERVER_ERROR)
    return sendResponse(res, {status: 'error', userMessage: err.userMessage, message: err.message})
  }

  // Send response with session token
  // if (process.env.APP_ENVIRONMENT === 'prod') ставить Secure и прочие секьюрности
  res.cookie('s', newUser.sessionToken, {maxAge: 1000 * 60 * 60 * 24 * 60, httpOnly: true}) // 60 days cookie time
  return sendResponse(res, {
    status: 'ok',
    userMessage: 'Регистрация прошла успешно ✔',
    message: 'Регистрация успешна',
    login: newUser.user.login,
  })
})

router.post('/login', async function(req: Request, res: Response, next: Next) {
  // Verify login and password
  const login = req.body.login?.trim()
  const password = req.body.password
  let loggedInUser
  let sessionToken
  try {
    ({ loggedInUser, sessionToken } = await getLoggedInUserAndSession(login, password, req))
  } catch (errors) {
    console.error(errors)
    res.status(HTTP_BAD_CREDENTIALS)
    return sendResponse(res, {status: 'error', userMessage: {errors}})
  }

  // Login user, i.e. send response with user and their session token
  // 2. Send them the response with the token and user details to further use it in frontend
  res.cookie('s', sessionToken.value, {maxAge: 1000 * 60 * 60 * 24 * 60, httpOnly: true}) // 60 days cookie time
  return sendResponse(res, {
    status: 'ok',
    userMessage: 'Вы успешно залогинены ✔',
    message: 'Логин успешен',
    login: loggedInUser.login,
  })
})

module.exports = router
export {}