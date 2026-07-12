const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { DomainError } = require('../utils/errors');

const COOKIE_NAME = 'transitops_token';

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role_name },
    env.jwtSecret,
    { expiresIn: '8h' }
  );
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    maxAge: 8 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
  });
}

function requireAuth(req, res, next) {
  const token = req.cookies ? req.cookies[COOKIE_NAME] : undefined;
  if (!token) {
    return next(new DomainError('UNAUTHENTICATED', 401, 'You must be logged in.'));
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return next(new DomainError('UNAUTHENTICATED', 401, 'Session expired. Please log in again.'));
  }
}

module.exports = {
  COOKIE_NAME,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
};
