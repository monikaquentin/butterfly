import Joi from 'joi'

import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 *  !-- VALIDATION MIDDLEWARE (function)
 *
 * @desc Validates each request before passing it to the controller.
 * @return promise void
 */
function validationMiddleware(schema: Joi.Schema): RequestHandler {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const options: object = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    }

    try {
      const value: object = await schema.validateAsync(request.body, options)
      request.body = value

      next()
    } catch (error: any) {
      const errors: string[] = []
      error.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push(error.message)
      })

      response.status(400).send({ errors: errors })
    }
  }
}

export default validationMiddleware
