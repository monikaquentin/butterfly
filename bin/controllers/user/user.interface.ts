import { Document } from 'mongoose'

/**
 *  !-- USER ATTRIBUTES (interface)
 *
 * @desc Defines all user attributes and their data types.
 */
interface UserIFC extends Document {
  userId: string
  identity: string
  username: string
  email: string
  password: string
  isActive: boolean
  token: string
  accessToken: string
  refreshToken: string
  createdAt: Date
  updatedAt: Date
  isValidPassword(password: string): boolean
}

export default UserIFC
