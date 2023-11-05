import Joi from 'joi'

/**
 *  !-- USER VALIDATION (object)
 *
 * @desc Validates the data type of all received request bodies.
 */
const signUp: object = Joi.object({
  username: Joi.string().max(36).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

const signIn: object = Joi.object({
  identity: Joi.string().max(36).required(),
  password: Joi.string().min(8).required()
})

const refresh: object = Joi.object({
  refreshToken: Joi.string().required()
})

export default { signUp, signIn, refresh }
