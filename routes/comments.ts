const express = require('express')
const router = express.Router()
import { NextFunction as Next, Request, Response } from 'express'
import { sendResponse } from '../logic/appAndHttp'
import { getUserByToken } from '../logic/db'

router.get('/welcome-test', async function(req: Request, res: Response, next: Next) {
  // Get user by token  
  const user = await getUserByToken(req.cookies.s)
  if (!user) {
    res.cookie('s', '', {httpOnly: true})
    return sendResponse(res, {status: 'error', userMessage: 'Чтобы сделать комментарий со своим личным юзернеймом, зарегистрируйтесь или залогиньтесь. Вы уверены, что хотите сделать комментарий анонимно? Ваш юзернейм в комментарии будет отображаться как "Аноним".'})
  }

  return sendResponse(res, {
    status: 'ok',
    userMessage: 'Hello, ' + user.login,
  })
})

module.exports = router
export {}