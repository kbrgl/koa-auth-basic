'use strict'

const auth = require('basic-auth')
const assert = require('assert')

/**
 * Return basic auth middleware with
 * the given options:
 *
 *  - `checkCredentials` credential check function that accepts name and pass
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function (opts) {
  opts = opts || {};

  assert(opts.checkCredentials, 'koa-auth-basic .checkCredentials is required')

  // avoids bugs due to pass-by-reference
  const checkCredentials = opts.checkCredentials

  return async function authBasic(ctx, next) {
    const credentials = auth(ctx)

    if (credentials) {
      const valid = await Promise.resolve(checkCredentials(credentials.name, credentials.pass))
      if (valid) {
        await next()
        return
      }
    }
    ctx.throw(401)
  }
}