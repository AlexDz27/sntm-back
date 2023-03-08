/**
 * @throws {object} Errors object
 */
export function verifyLoginAndPassword(
  login: null | undefined | string,
  password: null | undefined | string
  ): void {
    const errors: {login: any[], password: any[]} = {login: [], password: []}
    if (!login) errors.login.push('Логин должен быть заполнен')
    if (!password) errors.password.push('Пароль должен быть заполнен')
    if (typeof login === 'string' && login?.length < 2) {
      errors.login.push('Логин должен быть больше двух символов')
    }
    if (password && !isPasswordStrong(password)) {
      errors.password.push('Пароль должен содержать минимум 8 букв, хотя бы одну большую букву, хотя бы один из символов (+!@#$%^&*_-) и хотя бы одну цифру')
    }

    if (errors.login.length > 0 || errors.password.length > 0) {
      console.log({login, password, errors})
      throw errors
    }
}

function isPasswordStrong(password: string): boolean {
  const regexp = /^(?=.*\d)(?=.*[+!@#$%^&*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return regexp.test(password)
}