import Joi from 'joi'

/**
 *  !-- USER VALIDATION (object)
 *
 * @desc Validates the data type of all received request bodies.
 */
const verify: object = Joi.object({
  accessToken: Joi.string().required()
})

const profile: object = Joi.object({
  identity: Joi.string().max(36).required()
})

export default { verify, profile }
