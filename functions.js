// TODO: probably we will need to split the function to different files (modules)

function isPasswordStrong(password) {
  const regexp = /^(?=.*\d)(?=.*[+!@#$%^&*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return regexp.test(password)
}

module.exports = {
  isPasswordStrong,
}