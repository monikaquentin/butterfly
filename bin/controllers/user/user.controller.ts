import * as logger from '@/helpers/utils/logger'
import * as wrapper from '@/helpers/utils/wrapper'
import * as validator from '@/helpers/utils/validator'

import eTime from '@/root/helpers/utils/estimateTime'
import UserIFC from '@/controllers/user/user.interface'
import UserService from '@/controllers/user/user.service'
import userValidation from '@/controllers/user/user.validation'

import { verifyToken } from '@/helpers/utils/jwtToken'
import { http_success } from '@/helpers/definitions/errors'
import { passportAPI } from '@/middlewares/passport.middleware'
import { Router } from 'express'
import {
  ControllerIFC,
  ProcedureIFC,
  ResultIFC,
  PostRequestIFC,
  SendResponseIFC
} from '@/helpers/definitions/interfaces'

/**
 *  !-- USER CONTROLLER (class)
 *
 * @desc User service endpoint|controller|handler.
 * authentication, authorization, verification and validation .etc
 */
class UserController implements ControllerIFC {
  public path = '/v0/user'
  public router = Router()
  public ctx = 'user'

  private UserService: UserService = new UserService()

  constructor() {
    this.endpoints()
  }

  /**
   *  !-- USER ENDPOINT (procedure)
   *
   * @desc Defines endpoints, middleware, and controller paths.
   * @return void
   */
  private endpoints(): void {
    this.router.get(`${this.path}/verify/:accessToken`, [passportAPI], this.verify)
    this.router.post(`${this.path}/profile`, [passportAPI, verifyToken], this.profile)
  }

  /**
   *  !-- USER CONTROLLER - VERIFY USER (procedure)
   *
   * @desc Verify handler.
   * @return void
   */
  private verify: ProcedureIFC = async (request, response, next) => {
    const startTime: [number, number] = request.startTime
    const ctx: string = `POST:${this.ctx}-verify`

    const payload: object = request.params
    const validatePayload: ResultIFC = validator.isValid(payload, userValidation.verify)

    const postRequest: PostRequestIFC = async (validate) => {
      if (validate.error) return validate
      return this.UserService.verify(payload)
    }
    const sendResponse: SendResponseIFC = async (verify) => {
      const elapsedTime: number = eTime(startTime)
      const service: ResultIFC = await verify

      service.error
        ? logger.error(request.ip, ctx, `[${service.error.feed}]`, `(${elapsedTime} ms)`)
        : logger.info(request.ip, ctx, '[Successfully called]', `(${elapsedTime} ms)`)

      return wrapper.response(
        response,
        service.error ? 'FAIL' : 'SUCCESS',
        service.error ? service.error : http_success.OK,
        elapsedTime,
        service,
        service.error ? service.error.feed : undefined
      )
    }
    await sendResponse(postRequest(validatePayload))
  }

  /**
   *  !-- USER CONTROLLER - PROFILE (procedure)
   *
   * @desc Profile handler.
   * @return void
   */
  private profile: ProcedureIFC = async (request, response, next) => {
    const startTime: [number, number] = request.startTime
    const ctx: string = `POST:${this.ctx}-profile`

    const payload: UserIFC = request.body
    const validatePayload: ResultIFC = validator.isValid(payload, userValidation.profile)
    const postRequest: PostRequestIFC = async (validate) => {
      if (validate.error) return validate
      return this.UserService.profile(payload)
    }

    const sendResponse: SendResponseIFC = async (fetch) => {
      const elapsedTime: number = eTime(startTime)
      const service: ResultIFC = await fetch

      service.error
        ? logger.error(request.ip, ctx, `[${service.error.feed}]`, `(${elapsedTime} ms)`)
        : logger.info(request.ip, ctx, '[Successfully called]', `(${elapsedTime} ms)`)

      return wrapper.response(
        response,
        service.error ? 'FAIL' : 'SUCCESS',
        service.error ? service.error : http_success.OK,
        elapsedTime,
        service,
        service.error ? service.error.feed : undefined
      )
    }
    await sendResponse(postRequest(validatePayload))
  }
}

export default UserController
