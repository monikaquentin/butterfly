import Joi from 'joi'

/**
 *  !-- INDEX VALIDATION (object)
 *
 * @desc Validates the data type of all received request bodies.
 */
const index: object = Joi.object({
  // Do whatever
  message: Joi.string().max(25).required()
})

export default { index }
