const express = require('express');
const controller = require('./fuel.controller');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { createFuelLogSchema } = require('../../schemas/fuel');

const router = express.Router();

router.use(requireAuth);

router.get('/', requireRole('fleet_manager', 'dispatcher', 'financial_analyst'), controller.list);
router.post('/', requireRole('financial_analyst', 'fleet_manager'), validate(createFuelLogSchema), controller.create);

module.exports = router;
