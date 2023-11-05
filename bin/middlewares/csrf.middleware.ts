import { csurf } from '@/helpers/utils/csrf'

import { CookieOptions } from 'express'
import { ENV } from '@/helpers/infra/configs/global.config'

const env: any = ENV('/')

const ssl = env.app.ssl.toLowerCase() === 'true' ? true : false
const cookieConfig: CookieOptions = {
  httpOnly: true,
  maxAge: (24 * 60 * 60 * 1000) / 2,
  sameSite: 'strict',
  secure: ssl
}
const csrfProtection = csurf({ cookie: cookieConfig })

export { cookieConfig, csrfProtection }
