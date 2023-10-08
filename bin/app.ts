import * as logger from '@helpers/utils/logger'
import * as wrapper from '@helpers/utils/wrapper'

import cors from 'cors'
import PATH from 'path'
import helmet from 'helmet'
import mongoose from 'mongoose'
import flash from 'connect-flash'
import session from 'express-session'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import useragent from 'express-useragent'

import eTime from '@helpers/utils/estimateTime'

import { rateLimit } from 'express-rate-limit'
import { ENV } from '@helpers/infra/configs/global.config'
import { http_success } from '@helpers/definitions/errors'
import { ControllerIFC } from '@helpers/definitions/interfaces'
import express, { Request, Response, NextFunction, Application } from 'express'

const env: any = ENV('/')

class App {
  public express: Application
  public HOST: string
  public PORT: number

  private URI: string
  private CORS: RegExp
  private CONF: object

  constructor(controllers: ControllerIFC[], HOST: string, PORT: number) {
    this.express = express()
    this.HOST = HOST || 'localhost'
    this.PORT = PORT || 7952
    this.URI = `http://${HOST}:${PORT}`
    this.CORS = /^.+localhost(7952|3000|8080)$/
    this.CONF = {
      maxAge: 5,
      origin: this.CORS || ['*'],
      // ? ['*'] -> to expose all header, any type header will be allow to access
      // ? X-Requested-With,content-type,GET, POST, PUT, PATCH, DELETE, OPTIONS -> header type
      allowedHeaders: ['Authorization'],
      exposedHeaders: ['Authorization'],
      optionsSuccesStatus: 200
    }
    this.init_database_connection(process.hrtime())
    this.init_default_middleware()
    this.init_request_limiter()
    this.init_controllers(controllers)
  }

  // ! +--------------------------------------------------------------------------+
  // ! | Database connection (Default MongoDB)                                    |
  // ! +--------------------------------------------------------------------------+
  private init_database_connection(startTime: [number, number]): void {
    const ctx: string = 'connection:database'
    const options: object = {
      maxPoolSize: 100,
      socketTimeoutMS: 15000,
      wtimeoutMS: 15000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    try {
      mongoose.set('strictQuery', true).connect(env.database.url, options)
      logger.info(undefined, ctx, '[MongoDB connected]', `(${eTime(startTime)} ms)`)
    } catch (error: any) {
      logger.info(undefined, ctx, `[${error.message}]`, `(${eTime(startTime)} ms)`)
    }
  }

  // ! +--------------------------------------------------------------------------+
  // ! | Default Middleware                                                       |
  // ! +--------------------------------------------------------------------------+
  private init_default_middleware(): void {
    this.express
      .use((request: Request, response: Response, next: NextFunction): void => {
        request.index = { ...request.index, startTime: process.hrtime() }
        next()
      })
      .use(helmet({ contentSecurityPolicy: false }))
      .use(cors(this.CONF))
      .use(cookieParser(`${env.cookie.secret}`))
      .use(
        session({
          cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: false
          },
          secret: `${env.cookie.secret}`,
          resave: true,
          saveUninitialized: true
        })
      )
      .use(useragent.express())
      .use(flash())
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(express.static(PATH.join(__dirname + '/bin')))
      .use(compression())
  }

  // ! +--------------------------------------------------------------------------+
  // ! | Default Request Limit, DDOS attack mitigation                            |
  // ! +--------------------------------------------------------------------------+
  private init_request_limiter(): void {
    const limiter: any = rateLimit({
      windowMs: 15 * 60 * 1000,
      // ? 15 minutes
      max: 500,
      // ? Limit each IP to 500 requests per windowMs
      // ? If the request has exceeded the limit, give a message
      message: {
        status: false,
        code: 429,
        message: 'Too many requests, Your IP is temporarily blocked.'
      }
    })
    this.express.use(limiter)
  }

  // ! +--------------------------------------------------------------------------+
  // ! | App Controllers                                                          |
  // ! +--------------------------------------------------------------------------+
  private init_controllers(controllers: ControllerIFC[]): void {
    controllers.forEach((controller: ControllerIFC): void => {
      this.express.use('/api', controller.router)
    })

    this.express.use(/.*/, (request: Request, response: Response, next: NextFunction): void => {
      const feed: string = '[Butterfly] This service is running properly'
      const agent: any = request.useragent?.source
      wrapper.response(response, 'SUCCESS', http_success.OK, eTime(process.hrtime()), wrapper.data(agent), feed)
    })
  }

  // ! +--------------------------------------------------------------------------+
  // ! | Server Listening                                                         |
  // ! +--------------------------------------------------------------------------+
  public listen(): void {
    this.express.listen(this.PORT, (): void => {
      const ctx: string = 'app:listen'
      const uri: string = `http://127.0.0.1${this.PORT !== 80 ? ':' + this.PORT : ''}`

      logger.info(undefined, ctx, `[Butterfly listening on ${uri}]`, `(${eTime(process.hrtime())} ms)`)
    })
  }
}

export default App
