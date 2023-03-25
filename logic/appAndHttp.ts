import { Request, Response } from 'express'
import { APP_ENVIRONMENT } from '../env'
import { HTTP_BAD_REQUEST } from './constants'

interface AppResponse {
  status: 'ok' | 'error'
  userMessage?: object | string
  message?: any
  user?: any
  [propertyName: string]: any
}

export class AppError {
  error: any
  userMessage: object | string
  message?: any
  other?: any

  constructor(error: any, userMessage: any, message?: any, other?: any) {
    this.error = error
    this.userMessage = userMessage
    this.message = message
    this.other = other

    if (APP_ENVIRONMENT === 'prod') {
      delete this.error
      delete this.message
      delete this.other
    }
  }
}


export function sendResponse(httpResponse: Response, httpCode: number, appResponse: AppResponse) {
  if (APP_ENVIRONMENT === 'prod') {
    delete appResponse.message
  }

  httpResponse.status(httpCode)
  httpResponse.send(appResponse)
}

export function disallowNonGetNonApplicationJsonRequests(req: Request, res: Response) {
  if (req.method !== 'GET') {
    if (!req.is('application/json')) {
      return sendResponse(res, HTTP_BAD_REQUEST, {
        status: 'error',
        userMessage: 'Dont try to hack us pls'
      })
    }
  }
}