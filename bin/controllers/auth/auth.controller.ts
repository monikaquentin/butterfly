import * as logger from '@/helpers/utils/logger'
import * as wrapper from '@/helpers/utils/wrapper'
import * as validator from '@/helpers/utils/validator'

import eTime from '@/root/helpers/utils/estimateTime'
import UserIFC from '@/controllers/user/user.interface'
import AuthService from '@/controllers/auth/auth.service'
import authValidation from '@/controllers/auth/auth.validation'

import { http_success } from '@/helpers/definitions/errors'
import { passportAPI } from '@/middlewares/passport.middleware'
import { Router } from 'express'
import { csrfProtection } from '@/root/middlewares/csrf.middleware'
import {
  ControllerIFC,
  CookieIFC,
  ProcedureIFC,
  ResultIFC,
  PostRequestIFC,
  SendResponseIFC
} from '@/helpers/definitions/interfaces'

/**
 *  !-- AUTH CONTROLLER (class)
 *
 * @desc Auth service endpoint|controller|handler.
 * authentication, authorization, verification and validation .etc
 */
class AuthController implements ControllerIFC {
  public path = '/v0/auth'
  public router = Router()
  public ctx = 'auth'

  private AuthService: AuthService = new AuthService()

  constructor() {
    this.endpoints()
  }

  /**
   *  !-- AUTH ENDPOINT (procedure)
   *
   * @desc Defines endpoints, middleware, and controller paths.
   * @return void
   */
  private endpoints(): void {
    this.router.get(`${this.path}/csrf`, [passportAPI, csrfProtection], this.csrf)
    this.router.post(`${this.path}/sign-up`, [passportAPI, csrfProtection], this.signUp)
    this.router.post(`${this.path}/sign-in`, [passportAPI, csrfProtection], this.signIn)
    this.router.get(`${this.path}/sign-out`, [passportAPI, csrfProtection], this.signOut)
    this.router.get(`${this.path}/refresh`, [passportAPI], this.refresh)
  }

  /**
   *  !-- AUTH CONTROLLER - CSRF (procedure)
   *
   * @desc Auth csrf (GET) handler.
   * @return promise void
   */
  private csrf: ProcedureIFC = async (request, response, next) => {
    const startTime: [number, number] = request.startTime
    const ctx: string = `GET:${this.ctx}-csrf`

    const postRequest: PostRequestIFC = async (payload: any) => {
      return this.AuthService.csrf(payload, startTime)
    }
    const sendResponse: SendResponseIFC = async (csrf) => {
      const elapsedTime: number = eTime(startTime)
      const service: ResultIFC = await csrf

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
    await sendResponse(postRequest(wrapper.data(request)))
  }

  /**
   *  !-- AUTH CONTROLLER - SIGN UP (procedure)
   *
   * @desc Signip handler.
   * @return promise void
   */
  private signUp: ProcedureIFC = async (request, response, next) => {
    const startTime: [number, number] = request.startTime
    const ctx: string = `POST:${this.ctx}-sign-up`

    const payload: UserIFC = request.body
    const validatePayload: ResultIFC = validator.isValid(payload, authValidation.signUp)

    const postRequest: PostRequestIFC = async (validate) => {
      if (validate.error) return validate
      return this.AuthService.signUp(payload)
    }
    const sendResponse: SendResponseIFC = async (signUp) => {
      const elapsedTime: number = eTime(startTime)
      const service: ResultIFC = await signUp

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
   *  !-- AUTH CONTROLLER - SIGN IN (procedure)
   *
   * @desc Auth handler.
   * @return promise void
   */
  private signIn: ProcedureIFC = async (request, response, next) => {
    const startTime: [number, number] = request.startTime
    const ctx: string = `POST:${this.ctx}-sign-in`

    const payload: UserIFC = request.body
    const validatePayload: ResultIFC = validator.isValid(payload, authValidation.signIn)

    const postRequest: PostRequestIFC = async (validate) => {
      if (validate.error) return validate
      return this.AuthService.signIn(payload)
    }
    const sendResponse: SendResponseIFC = async (signIn) => {
      const elapsedTime: number = eTime(startTime)
      const service: ResultIFC = await signIn

      service.error
        ? logger.error(request.ip, ctx, `[${service.error.feed}]`, `(${elapsedTime} ms)`)
        : logger.info(request.ip, ctx, '[Successfully called]', `(${elapsedTime} ms)`)

      let httpOnlyCookie: CookieIFC = { name: '', value: '' }
      if (!service.error)
        httpOnlyCookie = {
          name: 'x-authorization',
          value: service.data.refreshToken
        }

      return wrapper.response(
        response,
        service.error ? 'FAIL' : 'SUCCESS',
        service.error ? service.error : http_success.OK,
        elapsedTime,
        service,
        service.error ? service.error.feed : undefined,
        service.error ? undefined : httpOnlyCookie
      )
    }
    await sendResponse(postRequest(validatePayload))
  }

  /**
   *  !-- AUTH CONTROLLER - SIGN OUT (procedure)
   *
   * @desc Auth handler.
   * @return promise void
   */
  private signOut: ProcedureIFC = async (request, response, next) => {
    const startTime: [number, number] = request.startTime
    const ctx: string = `GET:${this.ctx}-sign-out`

    const postRequest: PostRequestIFC = async (payload: any) => {
      return this.AuthService.signOut(payload)
    }
    const sendResponse: SendResponseIFC = async (signOut) => {
      const elapsedTime: number = eTime(startTime)
      const service: ResultIFC = await signOut

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
    await sendResponse(postRequest(wrapper.data({ req: request, res: response })))
  }

  /**
   *  !-- AUTH CONTROLLER - AUTH [REFRESH] (procedure)
   *
   * @desc Auth refresh handler.
   * @return promise void
   */
  private refresh: ProcedureIFC = async (request, response, next) => {
    const startTime: [number, number] = request.startTime
    const ctx: string = `GET:${this.ctx}-refresh-credential`

    const payload: object = { refreshToken: request?.cookies['x-authorization'] }
    const validatePayload: ResultIFC = validator.isValid(payload, authValidation.refresh)

    const postRequest: PostRequestIFC = async (validate) => {
      if (validate.error) return validate
      return this.AuthService.refresh(payload, startTime)
    }
    const sendResponse: SendResponseIFC = async (refresh) => {
      const elapsedTime: number = eTime(startTime)
      const service: ResultIFC = await refresh

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

export default AuthController
