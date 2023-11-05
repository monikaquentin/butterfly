import * as wrapper from '@/helpers/utils/wrapper'
import * as logger from '@/helpers/utils/logger'

import UserModel from '@/controllers/user/user.model'

import fs from 'fs'
import jwt from 'jsonwebtoken'
import eTime from '@/helpers/utils/estimateTime'

import { ENV } from '@/helpers/infra/configs/global.config'
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  http_error,
  ConflictError
} from '@/helpers/definitions/errors'
import {
  TokenIFC,
  GetKeyIFC,
  GenerateTokenIFC,
  DecodedTokenIFC,
  VerifyTokenIFC
} from '@/helpers/definitions/interfaces'

const env: any = ENV('/')

const getKey: GetKeyIFC = (keyPath) => fs.readFileSync(keyPath, 'utf8')

const generateToken: GenerateTokenIFC = async (payload, expiresIn = '5m') => {
  const privateKey: string = getKey(env.jwt.privateKeyPath)
  const verifyOptions: object = {
    ...env.jwt.options,
    expiresIn
  }
  return jwt.sign(payload, privateKey, verifyOptions)
}

const decodeToken: DecodedTokenIFC = (token) => {
  const publicKey: string = getKey(env.jwt.publicKeyPath)
  try {
    const decoded: TokenIFC | any = jwt.verify(token, publicKey, env.jwt.options)
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return wrapper.error(new ConflictError('Token expired.'))
    return wrapper.error(new ConflictError('Invalid token.'))
  }
}

const verifyToken: VerifyTokenIFC = (request, response, next) => {
  const ctx: string = 'JWT:verify-token'
  const startTime: [number, number] = request.startTime
  const elapsedTime: number = eTime(startTime)

  const token: any = request.headers['x-authorization']
  if (!token) {
    logger.error(request.ip, ctx, '[Token not found]', `(${elapsedTime} ms)`)
    return wrapper.response(
      response,
      'FAIL',
      http_error.UNAUTHORIZED,
      elapsedTime,
      wrapper.error(new NotFoundError('Token not found.')),
      'Verify Token'
    )
  }
  const decodedToken: any = decodeToken(token)
  if (decodedToken.error) {
    if (decodedToken.error.feed === 'Token expired.') {
      logger.error(request.ip, ctx, '[Token expired]', `(${elapsedTime} ms)`)
      return wrapper.response(
        response,
        'FAIL',
        http_error.UNAUTHORIZED,
        elapsedTime,
        wrapper.error(new UnauthorizedError('Token expired.')),
        'Verify Token'
      )
    }
    logger.error(request.ip, ctx, '[Invalid token]', `(${elapsedTime} ms)`)
    return wrapper.response(
      response,
      'FAIL',
      http_error.UNAUTHORIZED,
      elapsedTime,
      wrapper.error(new UnauthorizedError('Invalid token.')),
      'Verify Token'
    )
  }

  const { userId, authType }: any = decodedToken
  if (authType !== 'access') {
    logger.error(request.ip, ctx, '[Invalid token]', `(${elapsedTime} ms)`)
    return wrapper.response(
      response,
      'FAIL',
      http_error.FORBIDDEN,
      elapsedTime,
      wrapper.error(new ForbiddenError('Invalid token.')),
      'Verify Token'
    )
  }
  ;(async (): Promise<void> => {
    const user: any | null = await UserModel.findOne({ userId })
    if (user.err) {
      logger.error(request.ip, ctx, '[Forbiden access]', `(${elapsedTime} ms)`)
      return wrapper.response(
        response,
        'FAIL',
        http_error.FORBIDDEN,
        elapsedTime,
        wrapper.error(new ForbiddenError('Forbiden access.')),
        'Verify Token'
      )
    }
    request.user = { ...user.data }
    next()
  })()
}

export { generateToken, verifyToken, decodeToken }
