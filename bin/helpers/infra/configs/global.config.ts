import 'dotenv/config'

import confidence from 'confidence'

import { GetENVIFC } from '@/helpers/definitions/interfaces'

const config: object = {
  app: {
    env: process.env.APP_ENV,
    name: process.env.APP_NAME,
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT || '0'),
    ssl: process.env.APP_SSL,
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
    options: {
      algorithm: process.env.JWT_ALGORITHM,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER
    },
    privateKeyPath: process.env.JWT_PRIVATE_KEY_PATH,
    publicKeyPath: process.env.JWT_PUBLIC_KEY_PATH
  },
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '0')
  },
  cipher: {
    algorithm: process.env.CIPHER_ALGORITHM,
    ivLength: parseInt(process.env.CIPHER_IV_LENGTH || '0'),
    gcmKey: process.env.CIPHER_GCM_KEY,
    cbcKey: process.env.CIPHER_CBC_KEY,
    keys: {
      ed25519: {
        private: process.env.CIPHER_ED25519_SECRET,
        public: process.env.CIPHER_ED25519_PUBLIC
      },
      curve25519: {
        private: process.env.CIPHER_CURVE25519_SECRET,
        public: process.env.CIPHER_CURVE25519_PUBLIC
      },
      secgp256k1: {
        private: process.env.CIPHER_SECG_P256K1_SECRET,
        public: process.env.CIPHER_SECG_P256K1_PUBLIC
      },
      prime256v1: {
        private: process.env.CIPHER_PRIME256V1_SECRET,
        public: process.env.CIPHER_PRIME256V1_PUBLIC
      }
    },
    delimiter: process.env.CIPHER_DELIMITER
  }
}

const store: any = new confidence.Store(config)
const ENV: GetENVIFC = (key: any) => store.get(key)

export { ENV }
