type HttpResponse = {
  send: Function
}
type AppResponse = {
  status: 'ok' | 'error',
  userMessage: any,
  message?: any,
  user?: any
}

export function sendResponse(httpResponse: HttpResponse, appResponse: AppResponse) {
  httpResponse.send(appResponse)
}