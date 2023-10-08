import * as logger from '@helpers/utils/logger'
import * as wrapper from '@helpers/utils/wrapper'
import * as validator from '@helpers/utils/validator'

import eTime from '@root/helpers/utils/estimateTime'
import IndexIFC from '@root/controllers/index/index.interface'
import IndexService from '@root/controllers/index/index.service'
import validation from '@root/controllers/index/index.validation'

import { Router, Request, Response, NextFunction } from 'express'
import {
  ControllerIFC,
  ProcedureIFC,
  ResultIFC,
  PostRequestIFC,
  SendResponseIFC
} from '@helpers/definitions/interfaces'

import { http_success } from '@helpers/definitions/errors'
import { passportAPI as passport } from '@middlewares/passport.middleware'

/**
 *  !-- INDEX CONTROLLER (class)
 *
 * @desc Index service, example of endpoint|controller|handler.
 */
class IndexController implements ControllerIFC {
  // Do whatever
  public path: string = '/v1'
  public router: Router = Router()
  private ctx: string = 'index:controller'
  private IndexService: IndexService = new IndexService()

  constructor() {
    this.endpoints()
  }

  /**
   *  !-- INDEX ENDPOINT (procedure)
   *
   * @desc Defines endpoints, middleware, and controller paths (prefix).
   * @return void
   */
  private endpoints(): void {
    this.router.post(`${this.path}`, [passport], this.index)
  }

  /**
   *  !-- INDEX CONTROLLER - INDEX (procedure)
   *
   * @desc Index controller.
   * @return Promise<ResultIFC | void>
   */
  private index: ProcedureIFC = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<ResultIFC | void> => {
    const startTime: [number, number] = request.index.startTime
    const ctx: string = `POST:${this.ctx}`

    const payload: IndexIFC = request.body
    const validatePayload: ResultIFC = validator.isValid(payload, validation.index)

    const postRequest: PostRequestIFC = async (validate: ResultIFC): Promise<ResultIFC> => {
      if (validate.error) return validate
      return this.IndexService.index(payload, startTime)
    }

    const sendResponse: SendResponseIFC = async (index: Promise<ResultIFC>): Promise<void> => {
      const service: ResultIFC = await index
      const elapsedTime: number = eTime(startTime)

      service.error
        ? logger.error(request.ip, ctx, `[${service.error.feed.message}]`, `(${elapsedTime} ms)`)
        : logger.info(request.ip, ctx, '[Successfully called]', `(${elapsedTime} ms)`)

      return wrapper.response(
        response,
        service.error ? 'FAIL' : 'SUCCESS',
        service.error ? service.error : http_success.OK,
        elapsedTime,
        service,
        service.error ? service.error.feed : ''
      )
    }
    await sendResponse(postRequest(validatePayload))
  }
}

export default IndexController
