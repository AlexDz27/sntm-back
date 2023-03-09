import { getUser } from "./db"

/**
 * @throws {object} Errors object
 */
export function checkLoginAndPasswordCorrectFormat(
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
      console.error({login, password, errors})
      throw errors
    }
}

/**
 * @throws {object} Errors object
 */
export async function getLoggedInUser(
  login: null | undefined | string,
  password: null | undefined | string
): Promise<void> {
  const errors: {login: any[], password: any[], userNotFound: null | string} = {login: [], password: [], userNotFound: null}
  // Check if login and password are filled
  if (!login) errors.login.push('Логин должен быть заполнен')
  if (!password) errors.password.push('Пароль должен быть заполнен')

  // Check if user with such login and password exists
  const loggedInUser = await getUser(login as string, password as string)
  if (!loggedInUser) {
    errors.userNotFound = 'Извините, но пользователя с таким логином и/или паролем не существует'
  }

  // If there are errors - throw them
  if (errors.login.length > 0 || errors.password.length > 0 || errors.userNotFound) {
    console.error({login, password, errors})
    throw errors
  }

  // Else we return the loggedInUser :)
  return loggedInUser
}

function isPasswordStrong(password: string): boolean {
  const regexp = /^(?=.*\d)(?=.*[+!@#$%^&*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return regexp.test(password)
}