const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
import { Request, Response, NextFunction as Next } from 'express'
import DeviceDetector from 'node-device-detector'
import { disallowNonGetNonApplicationJsonRequests } from './logic/appAndHttp'

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const commentsRouter = require('./routes/comments')

const app = express()
app.disable('x-powered-by')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use((req: Request, res: Response, next: Next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.set('Access-Control-Allow-Credentials', 'true')

  next()
})
// Prevent CSRF attacks 
app.use((req: Request, res: Response, next: Next) => {
  disallowNonGetNonApplicationJsonRequests(req, res)

  next()
})

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/', commentsRouter)

export const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

console.log('got to here...')

module.exports = app