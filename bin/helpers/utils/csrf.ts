/*!
 * csurf
 * Copyright(c) 2011 Sencha Inc.
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 * Modified by re@redvelvet.me
 */

import * as cookie from 'cookie'
import * as wrapper from '@/helpers/utils/wrapper'

import elliptic from 'elliptic'
import eTime from '@/helpers/utils/estimateTime'

import Tokens, { Options } from 'csrf'
import { sign } from 'cookie-signature'
import { Request, Response, NextFunction } from 'express'
import { ENV } from '@/helpers/infra/configs/global.config'
import { UnauthorizedError, ConflictError, http_error } from '@/helpers/definitions/errors'

const env: any = ENV('/')
const secgp256k1 = new elliptic.ec('secp256k1')
const secret = env.cipher.keys.secgp256k1.private
const appKeySecgp256k1 = secgp256k1.keyFromPrivate(Buffer.from(secret.split('|')[1], 'hex'))

// Define the configuration options for the CSRF middleware
interface Config extends Options {
  cookie?: boolean | object
  sessionKey?: string
  value?: (request: Request) => string
  ignoreMethods?: string[]
}

/**
 * CSRF Protection Middleware.
 *
 * This middleware adds a `req.csrfToken()` function to create a token
 * that should be added to requests that affect
 * state, such as within hidden form fields, query string, etc.
 * This token is validated against the visitor's session.
 *
 * @param {Config} options - Configuration options for the CSRF middleware.
 * @return {Function} middleware
 * @public
 */
export function csurf(options: Config) {
  const opts = options || {}
  const cookieOpts = getCookieOptions(opts.cookie)
  const sessionKey = opts.sessionKey || 'session'
  const value = opts.value || defaultValue
  const tokens = new Tokens(opts)
  const ignoreMethods = opts.ignoreMethods === undefined ? ['GET', 'HEAD', 'OPTIONS'] : opts.ignoreMethods

  if (!Array.isArray(ignoreMethods)) throw new TypeError('Option ignoreMethods must be an array.')

  const ignoreMethod: any = getIgnoredMethods(ignoreMethods)

  return function csrf(request: Request, response: Response, next: NextFunction) {
    if (!verifyConfiguration(request, sessionKey, cookieOpts)) {
      return wrapper.response(
        response,
        'FAIL',
        http_error.CONFLICT,
        eTime(request.startTime),
        wrapper.error(new ConflictError('Misconfigured csrf.')),
        'Verify Token'
      )
    }

    let secret = getSecret(request, response, sessionKey, cookieOpts)
    let token: string

    request.csrfToken = function csrfToken() {
      let sec = !cookieOpts ? getSecret(request, response, sessionKey, cookieOpts) : secret

      if (token && sec === secret) return token

      if (sec === undefined) {
        sec = tokens.secretSync()
        setSecret(request, response, sessionKey, sec, cookieOpts)
      }

      secret = sec
      token = tokens.create(secret)

      const tokenBuffer = Buffer.from(token)
      const secgp256k1SignatureHex = appKeySecgp256k1.sign(tokenBuffer).toDER('hex')
      const secgp256k1SignatureBase64 = Buffer.from(secgp256k1SignatureHex, 'hex').toString('base64')
      setCookie(response, '_csrf-signature', secgp256k1SignatureBase64, cookieOpts)

      return token
    }

    try {
      const csrf_signature = getSignature(request, response, sessionKey, cookieOpts)
      if (value(request) && csrf_signature) {
        const token = Buffer.from(value(request))
        const signature = Buffer.from(csrf_signature, 'base64').toString('hex')
        if (!appKeySecgp256k1.verify(token, signature)) {
          return wrapper.response(
            response,
            'FAIL',
            http_error.UNAUTHORIZED,
            eTime(request.startTime),
            wrapper.error(new UnauthorizedError('Bad CSRF signature.')),
            'Verify Token'
          )
        }
      }
    } catch (error) {
      return wrapper.response(
        response,
        'FAIL',
        http_error.UNAUTHORIZED,
        eTime(request.startTime),
        wrapper.error(new UnauthorizedError('Bad CSRF signature.')),
        'Verify Token'
      )
    }

    if (!secret) {
      secret = tokens.secretSync()
      setSecret(request, response, sessionKey, secret, cookieOpts)
    }

    if (ignoreMethod[request.method] === undefined && !tokens.verify(secret, value(request))) {
      return wrapper.response(
        response,
        'FAIL',
        http_error.UNAUTHORIZED,
        eTime(request.startTime),
        wrapper.error(new UnauthorizedError('Invalid csrf token.')),
        'Verify Token'
      )
    }
    next()
  }
}

/**
 * Default value function, checking `request.body`
 * and `request.query` for the CSRF token.
 *
 * @param {Request} request - Express request object.
 * @return {string}
 * @api private
 */
function defaultValue(request: Request): string {
  return (
    (request.body && request.body._csrf) ||
    (request.query && request.query._csrf) ||
    request.headers['csrf-token'] ||
    request.headers['xsrf-token'] ||
    request.headers['x-csrf-token'] ||
    request.headers['x-xsrf-token']
  )
}

/**
 * Get options for the cookie.
 *
 * @param {boolean|object} options - Cookie configuration options.
 * @returns {object | undefined}
 * @api private
 */
function getCookieOptions(options: any): object | undefined {
  if (options !== true && typeof options !== 'object') return undefined

  const opts: any = Object.create(null)
  opts.key = '_csrf'
  opts.path = '/'

  if (options && typeof options === 'object') {
    for (const prop in options) {
      const val: any = options[prop]
      if (val !== undefined) opts[prop] = val
    }
  }
  return opts
}

/**
 * Get a lookup of ignored methods.
 *
 * @param {string[]} methods - List of ignored HTTP methods.
 * @returns {object}
 * @api private
 */
function getIgnoredMethods(methods: string[]): object {
  const obj: any = Object.create(null)

  for (const method of methods) obj[method] = true
  return obj
}

/**
 * Get the token secret from the request.
 *
 * @param {Request} request - Express request object.
 * @param {string} sessionKey - Session key.
 * @param {object} cookieOpts - Cookie configuration options.
 * @return {string}
 * @api private
 */
function getSecret(request: Request, response: Response, sessionKey: string, cookieOpts: any): string | void {
  const bag = getSecretBag(request, sessionKey, cookieOpts)
  const key = cookieOpts ? cookieOpts.key : 'csrfSecret'

  if (!bag)
    return wrapper.response(
      response,
      'FAIL',
      http_error.CONFLICT,
      eTime(request.startTime),
      wrapper.error(new ConflictError('Misconfigured csrf.')),
      'Verify Token'
    )

  return bag[key]
}

/**
 * Get the token signature from the request.
 *
 * @param {Request} request - Express request object.
 * @param {string} sessionKey - Session key.
 * @param {object} cookieOpts - Cookie configuration options.
 * @return {string}
 * @api private
 */
function getSignature(request: Request, response: Response, sessionKey: string, cookieOpts: any): string {
  const bag = getSecretBag(request, sessionKey, cookieOpts)
  const key = '_csrf-signature'

  if (!bag)
    wrapper.response(
      response,
      'FAIL',
      http_error.CONFLICT,
      eTime(request.startTime),
      wrapper.error(new ConflictError('Misconfigured csrf.')),
      'Verify Token'
    )

  return bag[key]
}

/**
 * Get the token secret bag from the request.
 *
 * @param {any} request - Express request object.
 * @param {string} sessionKey - Session key.
 * @param {object} cookieOpts - Cookie configuration options.
 * @return {any}
 * @api private
 */
function getSecretBag(request: any, sessionKey: string, cookieOpts: any): any {
  if (cookieOpts) {
    const cookieKey: string = cookieOpts.signed ? 'signedCookies' : 'cookies'
    return request[cookieKey]
  } else {
    return request[sessionKey]
  }
}

/**
 * Set a cookie on the HTTP response.
 *
 * @param {Response} response - Express response object.
 * @param {string} name - Cookie name.
 * @param {string} val - Cookie value.
 * @param {object} options - Cookie configuration options.
 * @api private
 */
function setCookie(response: Response, name: string, val: string, options: any) {
  const data = cookie.serialize(name, val, options)
  const prev: any = response.getHeaders()['set-cookie'] || []
  const header: any = Array.isArray(prev) ? prev.concat(data) : [prev, data]

  response.setHeader('set-cookie', header)
}

/**
 * Set the token secret on the request.
 *
 * @param {any} request - Express request object.
 * @param {Response} response - Express response object.
 * @param {string} sessionKey - Session key.
 * @param {string} val - Secret token value.
 * @param {object} cookieOpts - Cookie configuration options.
 * @api private
 */
function setSecret(request: any, response: Response, sessionKey: string, val: string, cookieOpts: any) {
  if (cookieOpts) {
    let value = val

    if (cookieOpts.signed) value = 's:' + sign(val, request.secret)

    setCookie(response, cookieOpts.key, value, cookieOpts)
  } else {
    request[sessionKey].csrfSecret = val
  }
}

/**
 * Verify the configuration against the request.
 * @private
 */
function verifyConfiguration(request: any, sessionKey: string, cookieOpts: any): boolean {
  if (!getSecretBag(request, sessionKey, cookieOpts)) return false
  if (cookieOpts && cookieOpts.signed && !request.secret) return false
  return true
}
