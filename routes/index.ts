import { Request, Response } from 'express'

const express = require('express')
const router = express.Router()

router.get('/', function(req: Request, res: Response) {
  res.send('respond with a resource (now TS)!!!')
})

module.exports = router
export {}