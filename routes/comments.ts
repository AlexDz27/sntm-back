const express = require('express')
const router = express.Router()
import { Request, Response } from 'express'
import { AppError, sendResponse } from '../logic/appAndHttp'
import { HTTP_BAD_CREDENTIALS, HTTP_OK, HTTP_SERVER_ERROR } from '../constants'
import { createComment, doesSessionTokenExist, getUserBySessionToken } from '../logic/db'

router.get('/comments/check-if-allowed-to-comment-as-original-user', async function(req: Request, res: Response) {
  const sessionToken = await doesSessionTokenExist(req.cookies.s)
  if (!sessionToken) return sendResponse(res, HTTP_BAD_CREDENTIALS, {
    status: 'error',
    userMessage: 'Чтобы сделать комментарий со своим личным логином, зарегистрируйтесь или залогиньтесь. Вы уверены, что хотите сделать комментарий анонимно? Ваш юзернейм в комментарии будет отображаться как "Аноним".'
  })

  return sendResponse(res, HTTP_OK, {
    status: 'ok'
  })
})

router.post('/comments/leave-comment', async function(req: Request, res: Response) {
  const { text, season, episode } = req.body
  try {
    let login
    const user = await getUserBySessionToken(req.cookies.s)
    if (!user) login = 'Аноним'
    else login = user.login
    
    const newComment = await createComment(text, season, episode, login)

    return sendResponse(res, HTTP_OK, {
      status: 'ok',
      message: 'Создание комментария успешно',
      comment: newComment
    })
  } catch (err) {
    console.error(err)
    const error = err as AppError
    return sendResponse(res, HTTP_SERVER_ERROR, {
      status: 'error',
      userMessage: error.userMessage,
    })
  }
})

module.exports = router
export {}