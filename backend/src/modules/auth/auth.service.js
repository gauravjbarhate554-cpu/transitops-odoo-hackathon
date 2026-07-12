const bcrypt = require('bcryptjs');
const { DomainError } = require('../../utils/errors');
const authRepo = require('./auth.repo');

async function login(email, password) {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    throw new DomainError('INVALID_CREDENTIALS', 401, 'Incorrect email or password.');
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new DomainError('INVALID_CREDENTIALS', 401, 'Incorrect email or password.');
  }
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

async function getCurrentUser(id) {
  const user = await authRepo.findUserById(id);
  if (!user) {
    throw new DomainError('UNAUTHENTICATED', 401, 'Session is no longer valid.');
  }
  return user;
}

module.exports = { login, getCurrentUser };
