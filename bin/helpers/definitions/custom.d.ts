import IndexInterface from '@controllers/index/index.interface'

/**
 *  !-- GLOBAL (any)
 *
 * @desc Declare "index" on every request same as index interface.
 */
declare global {
  // Do whatever
  namespace Express {
    export interface Request {
      startTime: [number, number]
      csrfToken(): string
    }
    export interface CookieOptions {
      key?: string | undefined
    }
  }
}
