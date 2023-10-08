import { Router, Request, Response, NextFunction } from 'express'

/**
 *  !-- CONTROLLER ATTRIBUTES (interface)
 *
 * @desc Defines all controller attributes and their data types.
 */
interface ControllerIFC {
  path: string
  router: Router
}
/**
 *  !-- COOKIE ATTRIBUTES (interface)
 *
 * @desc Defines all cookie attributes and their data types.
 */
interface CookieIFC {
  name: string
  value: string
}
/**
 *  !-- WRAPPER ATTRIBUTES (interface)
 *
 * @desc Defines all wrapper attributes and their data types.
 */
interface DataIFC {
  (data: object | null, ms?: number | any): { error: null; data: object | null; ms: number }
}
interface PaginationDataIFC {
  (data: object | null, meta: object): { error: null; data: object | null; meta: object }
}
interface ErrorIFC {
  (error: object): { error: object; data: null }
}
interface ResponseIFC {
  (
    response: Response,
    type: string,
    responseCode: number,
    ms: number,
    result: any,
    feed: string,
    httpOnlyCookie?: CookieIFC | any
  ): void
}
interface PaginationResponseIFC {
  (response: Response, type: string, result: any, feed: string, code: number): void
}
interface CheckErrorCodeIFC {
  (error: Error): object
}
interface ResultIFC {
  error: object | any
  data: object | null
}
interface PostRequestIFC {
  (result: ResultIFC): Promise<ResultIFC>
}
interface SendResponseIFC {
  (service: Promise<ResultIFC>): Promise<void>
}
/**
 *  !-- ENVIRONMENT ATTRIBUTES (interface)
 *
 * @desc Defines all environment attributes and their data types.
 */
interface GetENVIFC {
  (key: any): object
}
/**
 *  !-- PROCEDURE ATTRIBUTES (interface)
 *
 * @desc Defines all procedure attributes and their data types.
 */
interface ProcedureIFC {
  (request: Request, response: Response, next: NextFunction): Promise<ResultIFC | void> | void
}
/**
 *  !-- FUNCTION ATTRIBUTES (interface)
 *
 * @desc Defines all function attributes and their data types.
 */
interface FunctionIFC {
  (payload: any, startTime: [number, number]): any
}
/**
 *  !-- LOGGER ATTRIBUTES (interface)
 *
 * @desc Defines all logger attributes and their data types.
 */
interface LogIFC {
  (ip: string | undefined, context: string, feed: string, meta?: string): void
}
interface InfoLogIFC {
  (ip: string | undefined, context: string, feed: string, meta?: string): void
}
interface ErrorLogIFC {
  (ip: string | undefined, context: string, feed: string, meta?: string): void
}
/**
 *  !-- IsValidPayloadIFC ATTRIBUTES (interface)
 *
 * @desc Defines all IsValidPayloadIFC attributes and their data types.
 */
interface IsValidPayloadIFC {
  (payload: object, constraint: any): ResultIFC
}

export {
  ControllerIFC,
  CookieIFC,
  DataIFC,
  PaginationDataIFC,
  ErrorIFC,
  ResponseIFC,
  PaginationResponseIFC,
  CheckErrorCodeIFC,
  ResultIFC,
  PostRequestIFC,
  SendResponseIFC,
  GetENVIFC,
  ProcedureIFC,
  FunctionIFC,
  LogIFC,
  InfoLogIFC,
  ErrorLogIFC,
  IsValidPayloadIFC
}
