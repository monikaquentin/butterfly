import * as wrapper from '@helpers/utils/wrapper'

import { ConflictError } from '@helpers/definitions/errors'
import { IsValidPayloadIFC } from '@helpers/definitions/interfaces'

const isValid: IsValidPayloadIFC = (payload, constraint) => {
  const message: object | any = {}

  if (!payload) return wrapper.error(new Error('payload is empty'))

  const options: object = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  }
  const { value, error }: object | any = constraint.validate(payload, options)

  if (error) {
    error.details.forEach((detail: any): void => (message[`${detail.path}`] = detail.message))
    return wrapper.error(new ConflictError(message))
  }
  return wrapper.data(value)
}

export { isValid }
