import UserModel from '@/controllers/user/user.model'

/**
 *  !-- USER FINDER (Function)
 *  Find user by username, email or ID
 *
 * @return user(s) data [JSON]
 */
async function userFinder(identity: string, remove: string = '_v') {
  try {
    const byId = UserModel.find({ userId: identity }).select(`-${remove}`).exec()
    const byEmail = UserModel.find({ email: identity }).select(`-${remove}`).exec()
    const byUsername = UserModel.find({ username: identity }).select(`-${remove}`).exec()

    const [id, email, username] = await Promise.all([byId, byEmail, byUsername])

    if (id && id.length > 0) {
      return id[0]
    } else if (email && email.length > 0) {
      return email[0]
    } else if (username && username.length > 0) {
      return username[0]
    } else {
      return false
    }
  } catch (error) {
    throw error
  }
}

export default userFinder
