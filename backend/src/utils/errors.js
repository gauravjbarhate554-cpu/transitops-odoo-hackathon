class DomainError extends Error {
  constructor(code, httpStatus, message, field) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
    this.field = field;
  }
}

module.exports = { DomainError };
