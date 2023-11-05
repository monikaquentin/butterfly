import * as wrapper from '@/helpers/utils/wrapper'
import * as jwtAuth from '@/helpers/utils/jwtToken'

import userFinder from '@/helpers/utils/userFinder'
import UserModel from '@/controllers/user/user.model'
import UserIFC from '@/controllers/user/user.interface'

import { Model } from 'mongoose'
import { v5 as uuidv5 } from 'uuid'
import { FunctionIFC, TokenIFC } from '@/helpers/definitions/interfaces'
import {
  ConflictError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  InternalServerError
} from '@/helpers/definitions/errors'

/**
 *  !-- AUTH SERVICE (class)
 *
 * @desc Auth controller advanced logic.
 */
class AuthService {
  private UserModel: Model<UserIFC> = UserModel

  /**
   *  !-- GENERATE TOKEN (function)
   *
   * @desc This is how the JWT token generation.
   * @return promise object
   */
  private generateToken: FunctionIFC = async (payload) => {
    try {
      const userId: string = payload.userId
      const accessToken: string = await jwtAuth.generateToken({ userId, authType: 'access' }, '1m')
      const refreshToken: string = await jwtAuth.generateToken({ userId, authType: 'refresh' }, '12h')
      const result: object = {
        accessToken,
        refreshToken,
        identity: {
          userId,
          email: payload.email,
          username: payload.username,
          isActive: payload.isActive,
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt
        }
      }
      return result
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }

  /**
   *  !-- AUTH CSRF (function)
   *
   * @desc Signup a new user.
   * @return promise string | error
   */
  public csrf: FunctionIFC = async (payload) => {
    try {
      if (!payload.data) return wrapper.error(new ConflictError('Data required.'))
      return wrapper.data({ CSRFToken: payload.data.csrfToken() })
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }

  /**
   *  !-- AUTH SIGN UP (function)
   *
   * @desc Signup a new user.
   * @return promise string | error
   */
  public signUp: FunctionIFC = async (payload) => {
    try {
      const userExist: UserIFC | null = await UserModel.findOne({ email: payload.email })
      if (userExist) return wrapper.error(new ConflictError('User already exist.'))

      payload.userId = uuidv5(payload.username, `${process.env.APP_NAMESPACE}`)
      payload.email = payload.email.toLowerCase()

      return wrapper.data(await this.UserModel.create(payload))
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }

  /**
   *  !-- AUTH SIGN IN (function)
   *
   * @desc This is how the user signin.
   * @return promise string | error
   */
  public signIn: FunctionIFC = async (payload) => {
    try {
      const user: UserIFC | boolean = await userFinder(payload.identity.toLowerCase())

      if (!user) return wrapper.error(new NotFoundError('Identity unknown.'))
      if (!user.isActive) return wrapper.error(new ForbiddenError('User is inactive.'))
      if (!user.isValidPassword(payload.password)) return wrapper.error(new ConflictError('Wrong credentials given.'))

      return wrapper.data(await this.generateToken(user))
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }

  /**
   *  !-- AUTH SIGN OUT (function)
   *
   * @desc Signout a user.
   * @return promise string | error
   */
  public signOut: FunctionIFC = async (payload) => {
    try {
      if (!payload.data) return wrapper.error(new ConflictError('Data required.'))

      const request = payload.data.req
      const accessToken = request.cookies['x-authorization']

      for (const key in request.cookies) {
        payload.data.res.clearCookie(key)
      }

      return wrapper.data({ removed: accessToken || null })
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }

  /**
   *  !-- AUTH [REFRESH] (function)
   *
   * @desc This is how to refresh credential.
   * @return promise string | error
   */
  public refresh: FunctionIFC = async (payload) => {
    try {
      const refreshToken: string = payload.refreshToken
      const decodedToken: TokenIFC = jwtAuth.decodeToken(refreshToken)

      if (decodedToken.error) {
        const message: object =
          decodedToken.error.feed === 'Expired token'
            ? new ForbiddenError('Expired token')
            : new UnauthorizedError('Invalid token')
        return wrapper.error(message)
      }

      const user: UserIFC | null = await this.UserModel.findOne({ userId: decodedToken.userId })

      if (!user) return wrapper.error(new NotFoundError('Identity unknown.'))

      const data = await this.generateToken(user)

      delete data.refreshToken

      return wrapper.data(data)
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }
}

export default AuthService
