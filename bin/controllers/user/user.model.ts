import Aes256 from '@/root/helpers/utils/aes256'
import userIFC from '@/controllers/user/user.interface'

import { Schema, model } from 'mongoose'

/**
 *  !-- USER MODEL (schema)
 *
 * @desc User database schema.
 */
const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true, versionKey: false }
)

/**
 *  !-- PASSWORD HASHING (schema method)
 *
 * @desc hash the user's password before entering it into the database.
 * @return next
 */
UserSchema.pre<userIFC>('save', function (next): void {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = Aes256.encrypt(this.password)
  next()
})

/**
 *  !-- PASSWORD VERIFY (schema method)
 *
 * @desc verify user passwords.
 * @return promise error | boolean
 */
UserSchema.methods.isValidPassword = function (password: string): boolean {
  return Aes256.decrypt(this.password) === password
}

export default model<userIFC>('User', UserSchema)
