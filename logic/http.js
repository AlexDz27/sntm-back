// TODO: TS gives the ability to not write things like this and simply create a type (AppResponse)?

// TODO: jsdocs with comments like required, optional; can also contain other fields (user) if necessary for app logic; httpResponse must be res from Express
// status (req), userMessage (req), message (optional, must be hidden in prod)
/**
 * 
 * @param {Object} httpResponse 
 * @param {Object} appResponse
 * @param {string} appResponse.status Qeqwe asd
 * @returns {void}
 */
module.exports.sendResponse = function(httpResponse, appResponse) {
  // Do checks for validly written appResponse
  if (
    !appResponse.status || 
    (appResponse.status !== 'ok' && appResponse.status !== 'error')
  ) {
    throw new TypeError(`AppResponse status must be either 'ok' or 'error', got ${appResponse.status}`)
  }

  if (appResponse.userMessage === undefined || appResponse.userMessage === null) {
    throw new TypeError(`AppResponse userMessage field can't be undefined or null and must have a positive value, got ${appResponse.userMessage}`)
  }
  if (typeof appResponse.userMessage === 'string' && appResponse.userMessage.trim().length === 0) {
    throw new TypeError(`AppResponse userMessage field must be present, got an empty string`)
  }

  // Actually send Express's http response object
  httpResponse.send(appResponse)
}