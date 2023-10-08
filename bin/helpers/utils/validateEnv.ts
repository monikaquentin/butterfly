import { cleanEnv, host, port, str, num, url } from 'envalid'

/**
 *  !-- ENV VALIDATION (procedure)
 *
 * @desc Validates the data type and contents of all environment variables.
 * @return void
 */
function validateEnv(): void {
  //
  cleanEnv(process.env, {
    // ? +--------------------------------------------------------------------------+
    // ? | General                                                                  |
    // ? +--------------------------------------------------------------------------+
    APP_ENV: str({ choices: ['development', 'production'], default: 'development' }),
    APP_NAME: str({ default: 'butterfly' }),
    APP_HOST: host({ default: '127.0.0.1' }),
    APP_PORT: port({ default: 7952 }),
    APP_ED25519_SECRET: str(),
    APP_ED25519_PUBLIC: str(),
    APP_CURVE25519_SECRET: str(),
    APP_CURVE25519_PUBLIC: str(),
    APP_SECG_P256K1_SECRET: str(),
    APP_SECG_P256K1_PUBLIC: str(),
    APP_DELIMITER: str(),
    APP_NAMESPACE: str(),
    // ---
    // ? +--------------------------------------------------------------------------+
    // ? | Cookie                                                                   |
    // ? +--------------------------------------------------------------------------+
    COOKIE_SECRET: str(),
    // ---
    // ? +--------------------------------------------------------------------------+
    // ? | Authentication                                                           |
    // ? +--------------------------------------------------------------------------+
    BASIC_AUTH_USERNAME: str(),
    BASIC_AUTH_PASSWORD: str(),
    BASIC_AUTH_HEADER: str(),
    // ---
    // ? +--------------------------------------------------------------------------+
    // ? | Json-web-token                                                           |
    // ? +--------------------------------------------------------------------------+
    JWT_SECRET: str(),
    JWT_ALGORITHM: str({ default: 'RS256' }),
    JWT_AUDIENCE: str(),
    JWT_ISSUER: str({ default: 'butterfly' }),
    PRIVATE_KEY_PATH: str({ default: 'rs256.pem' }),
    PUBLIC_KEY_PATH: str({ default: 'rs256.pub' }),
    // ---
    // ? +--------------------------------------------------------------------------+
    // ? | Database                                                                 |
    // ? +--------------------------------------------------------------------------+
    DATABASE_URL: url(),
    DATABASE_NAME: str({ default: 'butterfly' }),
    DATABASE_USER: str({ default: 'root' }),
    DATABASE_PASSWORD: str({ default: '' }),
    DATABASE_HOST: str({ default: 'localhost' }),
    DATABASE_CONNECTION_LIMIT: num({ default: 100 }),
    // ---
    // ? +--------------------------------------------------------------------------+
    // ? | Cipher                                                                   |
    // ? +--------------------------------------------------------------------------+
    CIPHER_ALGORITHM: str({ default: 'aes-256-gcm' }),
    CIPHER_IV_LENGTH: num({ default: 16 }),
    CIPHER_GCM_KEY: str(),
    CIPHER_CBC_KEY: str()
  })
}

export default validateEnv
