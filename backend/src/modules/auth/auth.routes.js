const express = require('express');
const controller = require('./auth.controller');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { loginSchema } = require('../../schemas/auth');

const router = express.Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.me);

module.exports = router;
