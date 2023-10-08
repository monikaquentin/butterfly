import * as wrapper from '@helpers/utils/wrapper'

import eTime from '@helpers/utils/estimateTime'
import IndexIFC from '@root/controllers/index/index.interface'

import { FunctionIFC, ResultIFC } from '@helpers/definitions/interfaces'
import { InternalServerError } from '@helpers/definitions/errors'

/**
 *  !-- INDEX SERVICE (class)
 *
 * @desc Index controller advanced logic, example.
 */
class IndexService {
  /**
   *  !-- Index (function)
   *
   * @desc Index service.
   * @return Promise<ResultIFC>
   */
  public index: FunctionIFC = async (payload: IndexIFC): Promise<ResultIFC> => {
    // Do whatever
    try {
      return wrapper.data({ message: payload.message }, eTime(payload.startTime))
    } catch (error: any) {
      return wrapper.error(new InternalServerError(error.message))
    }
  }
}

export default IndexService
