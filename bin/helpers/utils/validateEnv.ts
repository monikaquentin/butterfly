import { cleanEnv, host, port, str, num, url } from 'envalid'

/**
 *  !-- ENV VALIDATION (procedure)
 *
 * @desc Validates the data type and contents of all environment variables.
 * @return void
 */
function validateEnv() {
  cleanEnv(process.env, {
    // +--------------------------------------------------------------------------+
    // | General                                                                  |
    // +--------------------------------------------------------------------------+
    APP_ENV: str({ choices: ['development', 'production'], default: 'development' }),
    APP_NAME: str({ default: 'iris' }),
    APP_HOST: host({ default: '127.0.0.1' }),
    APP_PORT: port({ default: 80 }),
    APP_SSL: str({ default: 'false' }),
    APP_NAMESPACE: str({ default: '' }),

    // +--------------------------------------------------------------------------+
    // | Cookie                                                                   |
    // +--------------------------------------------------------------------------+
    COOKIE_SECRET: str(),

    // +--------------------------------------------------------------------------+
    // | Authentication                                                           |
    // +--------------------------------------------------------------------------+
    BASIC_AUTH_USERNAME: str(),
    BASIC_AUTH_PASSWORD: str(),
    BASIC_AUTH_HEADER: str({ default: '' }),

    // +--------------------------------------------------------------------------+
    // | Json-web-token                                                           |
    // +--------------------------------------------------------------------------+
    JWT_SECRET: str(),
    JWT_ALGORITHM: str({ default: 'ES256' }),
    JWT_AUDIENCE: str({ default: 'redvelvet.me' }),
    JWT_ISSUER: str({ default: 'iris' }),
    JWT_PRIVATE_KEY_PATH: str(),
    JWT_PUBLIC_KEY_PATH: str(),

    // +--------------------------------------------------------------------------+
    // | Database                                                                 |
    // +--------------------------------------------------------------------------+
    DATABASE_URL: url({ default: 'mongodb://127.0.0.1:27017/iris' }),
    DATABASE_NAME: str({ default: 'iris' }),
    DATABASE_USER: str({ default: 'iris' }),
    DATABASE_PASSWORD: str({ default: '' }),
    DATABASE_HOST: host({ default: '127.0.0.1' }),
    DATABASE_CONNECTION_LIMIT: num({ default: 100 }),

    // +--------------------------------------------------------------------------+
    // | Cipher                                                                   |
    // +--------------------------------------------------------------------------+
    CIPHER_ALGORITHM: str({ default: 'aes-256-gcm' }),
    CIPHER_IV_LENGTH: num({ default: 16 }),
    CIPHER_GCM_KEY: str(),
    CIPHER_CBC_KEY: str(),
    CIPHER_ED25519_SECRET: str({ default: '' }),
    CIPHER_ED25519_PUBLIC: str({ default: '' }),
    CIPHER_CURVE25519_SECRET: str({ default: '' }),
    CIPHER_CURVE25519_PUBLIC: str({ default: '' }),
    CIPHER_SECG_P256K1_SECRET: str({ default: '' }),
    CIPHER_SECG_P256K1_PUBLIC: str({ default: '' }),
    CIPHER_PRIME256V1_SECRET: str({ default: '' }),
    CIPHER_PRIME256V1_PUBLIC: str({ default: '' }),
    CIPHER_DELIMITER: str()
  })
}

export default validateEnv
