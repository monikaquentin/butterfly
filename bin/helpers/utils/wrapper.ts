import * as logger from '@helpers/utils/logger'

import { cookieConfig } from '@helpers/definitions/config'
import {
  DataIFC,
  PaginationDataIFC,
  ErrorIFC,
  ResponseIFC,
  PaginationResponseIFC,
  CheckErrorCodeIFC
} from '@helpers/definitions/interfaces'
import {
  ConflictError,
  ExpectationFailedError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ServiceUnavailableError,
  GatewayTimeoutError,
  BadRequestError,
  http_error
} from '@helpers/definitions/errors'

const data: DataIFC = (data, ms) => ({ error: null, data, ms })
const error: ErrorIFC = (error) => ({ error, data: null })
const response: ResponseIFC = (response, type, responseCode, ms, result, feed, httpOnlyCookie) => {
  let status: boolean = Boolean(true)
  let data: object | null = result.data
  let code: number = responseCode
  if (type !== 'SUCCESS') {
    const errCode: any = checkErrorCode(result.error)
    status = false
    data = result.error.data || null
    feed = result.error.feed || feed
    code = result.error.code || errCode
    responseCode = errCode
  }
  try {
    const cookiesFound: boolean = httpOnlyCookie?.name && httpOnlyCookie?.value
    if (cookiesFound) response.cookie(httpOnlyCookie?.name, httpOnlyCookie?.value, cookieConfig)
  } catch (error: any) {
    const ctx: string = 'app:service-wrapper'
    logger.info(undefined, ctx, error.feed, 'error')
  }
  response.status(responseCode).json({ success: status, code, ms, data, feed })
}
const paginationData: PaginationDataIFC = (data, meta) => ({ error: null, data, meta })
const paginationResponse: PaginationResponseIFC = (response, type, result, feed, code) => {
  let status = true
  let data = result.data
  if (type !== 'SUCCESS') {
    status = false
    data = ''
    feed = result.error
  }
  response.status(code).json({ success: status, data, meta: result.meta, code, feed })
}
const checkErrorCode: CheckErrorCodeIFC = (error: Error) => {
  switch (error.constructor) {
    case BadRequestError:
      return http_error.BAD_REQUEST
    case ConflictError:
      return http_error.CONFLICT
    case ExpectationFailedError:
      return http_error.EXPECTATION_FAILED
    case ForbiddenError:
      return http_error.FORBIDDEN
    case GatewayTimeoutError:
      return http_error.GATEWAY_TIMEOUT
    case InternalServerError:
      return http_error.INTERNAL_ERROR
    case NotFoundError:
      return http_error.NOT_FOUND
    case ServiceUnavailableError:
      return http_error.SERVICE_UNAVAILABLE
    case UnauthorizedError:
      return http_error.UNAUTHORIZED
    default:
      return http_error.CONFLICT
  }
}

export { data, paginationData, paginationResponse, error, response, checkErrorCode }
