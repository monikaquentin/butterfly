// Define custom error classes for various HTTP error codes.

/**
 * @desc Represents a Bad Request error (HTTP 400).
 */
class BadRequestError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Bad Request') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents a Common Error that extends the built-in Error class.
 */
class CommonError extends Error {
  // eslint-disable-next-line no-useless-constructor
  constructor(message: string) {
    super(message)
  }
}

/**
 * @desc Represents a Conflict error (HTTP 409).
 */
class ConflictError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Conflict') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents an Expectation Failed error (HTTP 417).
 */
class ExpectationFailedError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Expectation Failed') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents a Forbidden error (HTTP 403).
 */
class ForbiddenError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Forbidden') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents a Gateway Timeout error (HTTP 504).
 */
class GatewayTimeoutError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Gateway Timeout') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents an Internal Server Error (HTTP 500).
 */
class InternalServerError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Internal Server Error') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents a Not Found error (HTTP 404).
 */
class NotFoundError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Not Found') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents a Service Unavailable error (HTTP 503).
 */
class ServiceUnavailableError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Service Unavailable') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

/**
 * @desc Represents an Unauthorized error (HTTP 401).
 */
class UnauthorizedError {
  public feed
  public data
  public code

  constructor(args: string | any = 'Unauthorized') {
    this.feed = args.feed || args
    this.data = args.data
    this.code = args.code
  }
}

// Define HTTP error and success codes as constants.

/**
 * @desc HTTP error codes and their corresponding status codes.
 */
const http_error: object | any = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  CONFLICT: 409,
  EXPECTATION_FAILED: 417,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

/**
 * @desc HTTP success codes and their corresponding status codes.
 */
const http_success: object | any = {
  OK: 200,
  CREATED: 201
}

export {
  BadRequestError,
  CommonError,
  ConflictError,
  ExpectationFailedError,
  ForbiddenError,
  GatewayTimeoutError,
  InternalServerError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
  http_error,
  http_success
}
