const express = require('express');
const controller = require('./vehicles.controller');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const {
  createVehicleSchema,
  updateVehicleSchema,
} = require('../../schemas/vehicle');

const router = express.Router();

router.use(requireAuth);

router.get('/available', requireRole('fleet_manager', 'dispatcher'), controller.listAvailable);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', requireRole('fleet_manager'), validate(createVehicleSchema), controller.create);
router.patch('/:id', requireRole('fleet_manager'), validate(updateVehicleSchema), controller.update);
router.post('/:id/retire', requireRole('fleet_manager'), controller.retire);

module.exports = router;
