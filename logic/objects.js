// TODO: сделать класс которые принимает объект (c той же логикой с ифами)? (чтобы было видно {status, userMessage, ...}) и чтобы 
// можно было добавлять филды по необходимости (например как щас мне надо филд user добавить)
// message should be anything (to be able to include details)

module.exports.AppResponse = class {
  constructor(status, userMessage, message, details) {
    this.status = status // required, 'ok' or 'error'
    // TODO: TS gives the possibility to not write if statements like this?
    if (this.status !== 'ok' && this.status !== 'error') throw new TypeError(`AppResponse status must be either 'ok' or 'error', got ${this.status}`)

    this.userMessage = userMessage // required, this is the message that user will see in the frontend app
    if (!this.userMessage) throw new TypeError(`AppResponse userMessage field must be present, got an empty value`)

    this.message = message // optional, message for developers, must be hidden in prod
    this.details = details // optional, details of the message for developers, must be hidden in prod
  }
}