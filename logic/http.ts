interface HttpResponse {
  send: Function
}
interface AppResponse {
  status: 'ok' | 'error'
  userMessage: any
  message?: any
  user?: any
  [propertyName: string]: any
}

export function sendResponse(httpResponse: HttpResponse, appResponse: AppResponse) {
  httpResponse.send(appResponse)
}