const cookieConfig: object = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'strict',
  secure: false
}

export { cookieConfig }
