const express = require('express')
const router = express.Router()
const { isPasswordStrong } = require('../functions')

router.post('/register', function(req, res, next) {
  const login = req.body.login?.trim()
  const password = req.body.password.trim()

  const errors = {login: [], password: []}
  if (login === undefined) errors.login.push('Логин должен быть заполнен')
  if (password === undefined) errors.password.push('Пароль должен быть заполнен')
  if (login?.length < 2) {
    errors.login.push('Логин должен быть больше двух символов')
  }
  if (password && !isPasswordStrong(password)) {
    errors.password.push('Пароль должен содержать минимум 8 букв, хотя бы одну большую букву, хотя бы один из символов (+!@#$%^&*_-) и хотя бы одну цифру')
  }
  if (errors.login.length > 0 || errors.password.length > 0) {
    console.log({login, password, errors})
    return res.send({status: 'error', errors})
  }

  return res.send({status: 'ok', message: 'Registration successful', user: 'todo'})
})

module.exports = router
