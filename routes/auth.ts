const express = require('express')
const router = express.Router()
import { Request, Response } from 'express'
import { HTTP_BAD_CREDENTIALS, HTTP_BAD_REQUEST, HTTP_SERVER_ERROR, HTTP_OK } from '../logic/constants'
import { createUserAndSessionToken } from '../logic/db'
import { areLoginAndPasswordCorrectFormat, getLoginAndPasswordFormatErrors, userAlreadyExists, getLoggedInUserAndSession } from '../logic/auth'
import { AppError, sendResponse } from '../logic/appAndHttp'
import { APP_ENVIRONMENT } from '../env'

router.post('/register', async function(req: Request, res: Response) {
  // Check if format of login and password is correct
  const login = req.body.login?.trim()
  const password = req.body.password
  if (!areLoginAndPasswordCorrectFormat(login, password)) {
    const errors = getLoginAndPasswordFormatErrors(login, password)

    return sendResponse(res, HTTP_BAD_REQUEST, {
      status: 'error',
      userMessage: {errors}
    })
  }

  // Check if user already exists
  try {
    if (await userAlreadyExists(login)) {
      return sendResponse(res, HTTP_BAD_CREDENTIALS, {
        status: 'error',
        userMessage: `Извините, но пользователь с логином ${login} уже существует. Попробуйте использовать другой логин.`
      })
    }
  } catch (err) {
    console.error(err)
    const error = err as AppError
    return sendResponse(res, HTTP_SERVER_ERROR, {
      status: 'error',
      userMessage: error.userMessage
    })
  }

  // All good! Create user in database
  let newUser
  try {
    newUser = await createUserAndSessionToken(login, password, req)
  } catch (err) {
    console.error(err)
    const error = err as AppError
    return sendResponse(res, HTTP_SERVER_ERROR, {
      status: 'error',
      userMessage: error.userMessage,
    })
  }

  // Send response with session token
  if (APP_ENVIRONMENT === 'prod') {
    // TODO: check how it works in prod
    res.cookie('s', newUser.sessionToken, {
      maxAge: 1000 * 60 * 60 * 24 * 60,
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    }) // 60 days cookie time
  } else {
    res.cookie('s', newUser.sessionToken, {maxAge: 1000 * 60 * 60 * 24 * 60, httpOnly: true}) // 60 days cookie time
  }
  return sendResponse(res, HTTP_OK, {
    status: 'ok',
    userMessage: 'Регистрация прошла успешно ✔',
    message: 'Регистрация успешна',
    login: newUser.user.login,
  })
})

router.post('/login', async function(req: Request, res: Response) {
  // Verify login and password
  const login = req.body.login?.trim()
  const password = req.body.password
  let loggedInUser
  let sessionToken
  try {
    ({ loggedInUser, sessionToken } = await getLoggedInUserAndSession(login, password, req))
  } catch (errors) {
    console.error(errors)
    return sendResponse(res, HTTP_BAD_CREDENTIALS,
      {status: 'error', userMessage: {errors}})
  }

  // Login user, i.e. send response with user and their session token
  // 2. Send them the response with the token and user details to further use it in frontend
  if (APP_ENVIRONMENT === 'prod') {
    // TODO: check how it works in prod
    res.cookie('s', sessionToken.value, {
      maxAge: 1000 * 60 * 60 * 24 * 60,
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    }) // 60 days cookie time
  } else {
    res.cookie('s', sessionToken.value, {maxAge: 1000 * 60 * 60 * 24 * 60, httpOnly: true}) // 60 days cookie time
  }
  return sendResponse(res, HTTP_OK, {
    status: 'ok',
    userMessage: 'Вы успешно залогинены ✔',
    message: 'Логин успешен',
    login: loggedInUser.login,
  })
})

module.exports = router
export {}