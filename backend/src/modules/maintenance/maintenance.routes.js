const express = require('express');
const controller = require('./maintenance.controller');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const {
  createMaintenanceSchema,
  closeMaintenanceSchema,
} = require('../../schemas/maintenance');

const router = express.Router();

router.use(requireAuth);

router.get('/', requireRole('fleet_manager', 'dispatcher', 'financial_analyst'), controller.list);
router.post('/', requireRole('fleet_manager'), validate(createMaintenanceSchema), controller.open);
router.post('/:id/close', requireRole('fleet_manager'), validate(closeMaintenanceSchema), controller.close);

module.exports = router;
