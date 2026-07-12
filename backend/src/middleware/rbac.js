const { DomainError } = require('../utils/errors');

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new DomainError('FORBIDDEN', 403, 'Your role cannot perform this action.'));
    }
    next();
  };
}

module.exports = { requireRole };
