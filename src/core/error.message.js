const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    AUTHFAILURE: 408
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
    AUTHFAILURE: 'Auth fail'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.AUTHFAILURE, statusCode = StatusCode.AUTHFAILURE) {
        super(message, statusCode)
    }
}


module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}