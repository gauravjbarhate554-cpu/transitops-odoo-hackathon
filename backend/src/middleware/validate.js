const { DomainError } = require('../utils/errors');

function firstIssueMessage(issues) {
  const issue = issues[0];
  return { message: issue.message, field: issue.path.join('.') || undefined };
}

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const { message, field } = firstIssueMessage(result.error.issues);
      return next(new DomainError('VALIDATION_ERROR', 400, message, field));
    }
    req[source] = result.data;
    next();
  };
}

module.exports = { validate };
