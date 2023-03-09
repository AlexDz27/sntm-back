const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
import { Request, Response, NextFunction as Next } from 'express'

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')

const app = express()

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

app.use('/', indexRouter)
app.use('/', authRouter)

module.exports = app