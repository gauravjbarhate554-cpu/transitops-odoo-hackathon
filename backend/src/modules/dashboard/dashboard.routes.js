const express = require('express');
const controller = require('./dashboard.controller');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/kpis', controller.kpis);

module.exports = router;
