import morgan from 'morgan'
import moment from 'moment'

import { Request, Response } from 'express'
import { createLogger, transports, format, Logger } from 'winston'
import { LogIFC, InfoLogIFC, ErrorLogIFC } from '@/helpers/definitions/interfaces'

// Import the printf function from Winston's format module.
const { printf } = format

// Create and configure a logger using Winston.
const logger: Logger = createLogger({
  level: 'info',
  // Define the log message format, including the log level (uppercase) and the log message itself.
  format: printf(
    ({ level, context, ip, message, meta }) =>
      `${level.toUpperCase()} ${ip || '::ffff:127.0.0.1'} ${context} ${message} ${meta} | ${moment().format()}`
  ),
  defaultMeta: { service: 'app:service' },
  // Configure the logger to output logs to the console.
  transports: [
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.Console({
      level: 'info',
      handleExceptions: true
    })
  ],
  exitOnError: false
})

const log: LogIFC = (ip, context, message, meta) => logger.info({ ip, context, message, meta })
const info: InfoLogIFC = (ip, context, message, meta) => logger.info({ ip, context, message, meta })
const error: ErrorLogIFC = (ip, context, message, meta) => logger.error({ ip, context, message, meta })

const init: object = (): object => {
  return morgan((tokens: any, request: Request, Response: Response): any => {
    const logData: object = {
      method: tokens.method(request, Response),
      url: tokens.url(request, Response),
      code: tokens.status(request, Response),
      contentLength: tokens.Response(request, Response, 'content-length'),
      responseTime: `${tokens['Responseponse-time'](request, Response, '0')}`, // in milisecond (ms)
      date: tokens.date(request, Response, 'iso'),
      ip: tokens['remote-addr'](request, Response)
    }
    const obj: object = {
      context: 'service-info',
      scope: 'audit-log',
      message: 'Logging service...',
      meta: logData
    }
    logger.info(obj)
  })
}

export { log, init, info, error }
