const authService = require('./auth.service');
const { signToken, setAuthCookie, clearAuthCookie } = require('../../middleware/auth');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = signToken({ id: user.id, role_name: user.role_name });
    setAuthCookie(res, token);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  clearAuthCookie(res);
  res.status(204).send();
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me };
