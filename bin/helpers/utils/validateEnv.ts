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
    NODE_APP_ENV: str({ choices: ['development', 'production'], default: 'development' }),
    NODE_APP_NAME: str({ default: 'iris' }),
    NODE_APP_HOST: host({ default: '127.0.0.1' }),
    NODE_APP_PORT: port({ default: 80 }),
    NODE_APP_SSL: str({ default: 'false' }),
    NODE_APP_NAMESPACE: str({ default: '' }),

    // +--------------------------------------------------------------------------+
    // | Cookie                                                                   |
    // +--------------------------------------------------------------------------+
    NODE_COOKIE_SECRET: str(),

    // +--------------------------------------------------------------------------+
    // | Authentication                                                           |
    // +--------------------------------------------------------------------------+
    NODE_BASIC_AUTH_USERNAME: str(),
    NODE_BASIC_AUTH_PASSWORD: str(),
    NODE_BASIC_AUTH_HEADER: str({ default: '' }),

    // +--------------------------------------------------------------------------+
    // | Json-web-token                                                           |
    // +--------------------------------------------------------------------------+
    NODE_JWT_SECRET: str(),
    NODE_JWT_ALGORITHM: str({ default: 'ES256' }),
    NODE_JWT_AUDIENCE: str({ default: 'redvelvet.me' }),
    NODE_JWT_ISSUER: str({ default: 'iris' }),
    NODE_JWT_PRIVATE_KEY_PATH: str(),
    NODE_JWT_PUBLIC_KEY_PATH: str(),

    // +--------------------------------------------------------------------------+
    // | Database                                                                 |
    // +--------------------------------------------------------------------------+
    NODE_DATABASE_URL: url({ default: 'mongodb://127.0.0.1:27017/iris' }),
    NODE_DATABASE_NAME: str({ default: 'iris' }),
    NODE_DATABASE_USER: str({ default: 'iris' }),
    NODE_DATABASE_PASSWORD: str({ default: '' }),
    NODE_DATABASE_HOST: host({ default: '127.0.0.1' }),
    NODE_DATABASE_CONNECTION_LIMIT: num({ default: 100 }),

    // +--------------------------------------------------------------------------+
    // | Cipher                                                                   |
    // +--------------------------------------------------------------------------+
    NODE_CIPHER_ALGORITHM: str({ default: 'aes-256-gcm' }),
    NODE_CIPHER_IV_LENGTH: num({ default: 16 }),
    NODE_CIPHER_GCM_KEY: str(),
    NODE_CIPHER_CBC_KEY: str(),
    NODE_CIPHER_ED25519_SECRET: str({ default: '' }),
    NODE_CIPHER_ED25519_PUBLIC: str({ default: '' }),
    NODE_CIPHER_CURVE25519_SECRET: str({ default: '' }),
    NODE_CIPHER_CURVE25519_PUBLIC: str({ default: '' }),
    NODE_CIPHER_SECG_P256K1_SECRET: str({ default: '' }),
    NODE_CIPHER_SECG_P256K1_PUBLIC: str({ default: '' }),
    NODE_CIPHER_PRIME256V1_SECRET: str({ default: '' }),
    NODE_CIPHER_PRIME256V1_PUBLIC: str({ default: '' }),
    NODE_CIPHER_DELIMITER: str()
  })
}

export default validateEnv
