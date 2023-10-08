import 'dotenv/config'

import confidence from 'confidence'

import { GetENVIFC } from '@helpers/definitions/interfaces'

const config: object = {
  app: {
    env: process.env.APP_ENV,
    name: process.env.APP_NAME,
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
    ed25519Secret: process.env.ED25519_SECRET,
    ed25519Public: process.env.ED25519_PUBLIC,
    curve25519Secret: process.env.CURVE25519_SECRET,
    curve25519Public: process.env.CURVE25519_PUBLIC,
    secgp256k1Secret: process.env.SECG_P256K1_SECRET,
    secgp256k1Public: process.env.SECG_P256K1_PUBLIC,
    delimiter: process.env.DELIMITER,
    namespace: process.env.APP_NAMESPACE
  },
  cookie: {
    secret: process.env.COOKIE_SECRET
  },
  authentication: {
    username: process.env.BASIC_AUTH_USERNAME,
    password: process.env.BASIC_AUTH_PASSWORD,
    header: process.env.BASIC_AUTH_HEADER
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    algorithm: process.env.JWT_ALGORITHM,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    private: process.env.PRIVATE_KEY_PATH,
    public: process.env.PUBLIC_KEY_PATH
  },
  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    connectionLimit: process.env.DATABASE_CONNECTION_LIMIT
  },
  cipher: {
    algorithm: process.env.CIPHER_ALGORITHM,
    ivLength: parseInt(process.env.CIPHER_IV_LENGTH!),
    gcm_key: process.env.CIPHER_GCM_KEY,
    cbc_key: process.env.CIPHER_CBC_KEY
  }
}

const store: any = new confidence.Store(config)
const ENV: GetENVIFC = (key: any) => store.get(key)

export { ENV }
