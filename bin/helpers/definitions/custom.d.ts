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
      index: IndexInterface
    }
  }
}
