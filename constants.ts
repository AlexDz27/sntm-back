export const HTTP_OK = 200
export const HTTP_SERVER_ERROR = 500
export const HTTP_BAD_REQUEST = 400
export const HTTP_BAD_CREDENTIALS = 401 // Official name is 'Unauthorized'

export const ADMINISTRATION_EMAIL = 'sntm@gmail.com'

export const GENERIC_SERVER_ERROR_USER_MESSAGE = `Извините, произошла ошибка на нашем сервере. \
Попробуйте позже. Также вы можете сообщить нам об ошибке по почте - ${ADMINISTRATION_EMAIL}`
export const DATABASE_CONNECTION_ERROR_USER_MESSAGE = `Извините, мы не смогли подключиться к нашей базе данных. \
Попробуйте позже. Также вы можете сообщить нам об ошибке по почте - ${ADMINISTRATION_EMAIL}`
export const ARGON2_ERROR_MESSAGE = 'Error in argon2\'s password hashing function'