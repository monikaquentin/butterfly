import * as wrapper from '@/helpers/utils/wrapper'
import * as jwtAuth from '@/helpers/utils/jwtToken'

import userFinder from '@/helpers/utils/userFinder'
import UserModel from '@/controllers/user/user.model'
import UserIFC from '@/controllers/user/user.interface'

import { Model } from 'mongoose'
import { FunctionIFC, TokenIFC } from '@/helpers/definitions/interfaces'
import { NotFoundError, ForbiddenError, InternalServerError } from '@/helpers/definitions/errors'

/**
 *  !-- USER SERVICE (class)
 *
 * @desc User controller advanced logic.
 */
class UserService {
  private UserModel: Model<UserIFC> = UserModel

  /**
   *  !-- USER VERIFY (function)
   *
   * @desc This is how verify user.
   * @return promise string | error
   */
  public verify: FunctionIFC = async (payload) => {
    try {
      const accessToken: string = payload.accessToken
      const decodedToken: TokenIFC = jwtAuth.decodeToken(accessToken)

      const user: UserIFC | null = await this.UserModel.findOne({ userId: decodedToken.userId })

      if (!user) return wrapper.error(decodedToken.error)
      if (user.isActive) return wrapper.error(new ForbiddenError('User already active.'))

      await UserModel.findOneAndUpdate({ userId: decodedToken.userId }, { isActive: true })

      return wrapper.data(undefined)
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }

  /**
   *  !-- USER PROFILE (function)
   *
   * @desc This is how get user profile.
   * @return promise string | error
   */
  public profile: FunctionIFC = async (payload) => {
    try {
      const user: UserIFC | boolean = await userFinder(payload.identity.toLowerCase(), 'password')

      if (!user) return wrapper.error(new NotFoundError('User not found'))

      return wrapper.data(user)
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }
}

export default UserService
