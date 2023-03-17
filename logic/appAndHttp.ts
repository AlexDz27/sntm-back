interface HttpResponse {
  send: Function
}
interface AppResponse {
  status: 'ok' | 'error'
  userMessage: object | string
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

    if (process.env.APP_ENVIRONMENT === 'prod') {
      delete this.error
      delete this.message
      delete this.other
    }
  }
}

export function sendResponse(httpResponse: HttpResponse, appResponse: AppResponse) {
  if (process.env.APP_ENVIRONMENT === 'prod') {
    delete appResponse.message
  }

  httpResponse.send(appResponse)
}