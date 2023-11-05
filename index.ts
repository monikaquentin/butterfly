/**
 * -------------------------------------------------------------------------------
 * © 2023 RedVelvet All Rights Reserved
 * -------------------------------------------------------------------------------
 *
 * Author : <re@redvelvet.me> (https://redvelvet.me)
 * GitHub : https://github.com/monikaquentin
 * GitLab : https://gitlab.com/monikaquentin
 *
 */

import 'dotenv/config'
import 'module-alias/register'

import Express from '@/root/app'
import validateEnv from '@/helpers/utils/validateEnv'
import AuthController from '@/root/controllers/auth/auth.controller'
import UserController from '@/root/controllers/user/user.controller'

validateEnv()

/**
 *  !-- APP (Express)
 *
 * @desc Defines each express application.
 */
const apiEndpoints: Array<any> = [new AuthController(), new UserController()]
const App: Express = new Express(apiEndpoints, String(process.env.APP_HOST), Number(process.env.APP_PORT))

App.listen()
