/* eslint-disable require-jsdoc */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
