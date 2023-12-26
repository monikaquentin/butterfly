import 'dotenv/config'

import confidence from 'confidence'

import { GetENVIFC } from '@/helpers/definitions/interfaces'

const config: object = {
  app: {
    env: process.env.NODE_APP_ENV,
    name: process.env.NODE_APP_NAME,
    host: process.env.NODE_APP_HOST,
    port: parseInt(process.env.NODE_APP_PORT || '0'),
    ssl: process.env.NODE_APP_SSL,
    namespace: process.env.NODE_APP_NAMESPACE
  },
  cookie: {
    secret: process.env.NODE_COOKIE_SECRET
  },
  authentication: {
    username: process.env.NODE_BASIC_AUTH_USERNAME,
    password: process.env.NODE_BASIC_AUTH_PASSWORD,
    header: process.env.NODE_BASIC_AUTH_HEADER
  },
  jwt: {
    secret: process.env.NODE_JWT_SECRET,
    options: {
      algorithm: process.env.NODE_JWT_ALGORITHM,
      audience: process.env.NODE_JWT_AUDIENCE,
      issuer: process.env.NODE_JWT_ISSUER
    },
    privateKeyPath: process.env.NODE_JWT_PRIVATE_KEY_PATH,
    publicKeyPath: process.env.NODE_JWT_PUBLIC_KEY_PATH
  },
  database: {
    url: process.env.NODE_DATABASE_URL,
    host: process.env.NODE_DATABASE_HOST,
    name: process.env.NODE_DATABASE_NAME,
    user: process.env.NODE_DATABASE_USER,
    password: process.env.NODE_DATABASE_PASSWORD,
    connectionLimit: parseInt(process.env.NODE_DATABASE_CONNECTION_LIMIT || '0')
  },
  cipher: {
    algorithm: process.env.NODE_CIPHER_ALGORITHM,
    ivLength: parseInt(process.env.NODE_CIPHER_IV_LENGTH || '0'),
    gcmKey: process.env.NODE_CIPHER_GCM_KEY,
    cbcKey: process.env.NODE_CIPHER_CBC_KEY,
    keys: {
      ed25519: {
        private: process.env.NODE_CIPHER_ED25519_SECRET,
        public: process.env.NODE_CIPHER_ED25519_PUBLIC
      },
      curve25519: {
        private: process.env.NODE_CIPHER_CURVE25519_SECRET,
        public: process.env.NODE_CIPHER_CURVE25519_PUBLIC
      },
      secgp256k1: {
        private: process.env.NODE_CIPHER_SECG_P256K1_SECRET,
        public: process.env.NODE_CIPHER_SECG_P256K1_PUBLIC
      },
      prime256v1: {
        private: process.env.NODE_CIPHER_PRIME256V1_SECRET,
        public: process.env.NODE_CIPHER_PRIME256V1_PUBLIC
      }
    },
    delimiter: process.env.NODE_CIPHER_DELIMITER
  }
}

const store: any = new confidence.Store(config)
const ENV: GetENVIFC = (key: any) => store.get(key)

export { ENV }
