import passport from 'passport'

import { BasicStrategy } from 'passport-http'
import { ENV } from '@helpers/infra/configs/global.config'

class Auth {
  private username: string
  private password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  public validate(username: string, password: string): boolean {
    return this.username === username && this.password === password
  }
}

function authenticate(username: string, password: string, callback: any) {
  const env: any = ENV('/')
  const user: Auth = new Auth(env.authentication.username, env.authentication.password)

  if (!user.validate(username, password)) return callback(null, false)
  return callback(null, user)
}

passport.use(new BasicStrategy(authenticate))

const initialize: object = (): object => passport.initialize()
const passportAPI: any = passport.authenticate('basic', { session: false })

export { initialize, passportAPI }
