const express = require('express');
const controller = require('./trips.controller');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const {
  createTripSchema,
  completeTripSchema,
  cancelTripSchema,
} = require('../../schemas/trip');

const router = express.Router();

router.use(requireAuth);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', requireRole('dispatcher', 'fleet_manager'), validate(createTripSchema), controller.create);
router.post('/:id/dispatch', requireRole('dispatcher', 'fleet_manager'), controller.dispatch);
router.post('/:id/complete', requireRole('dispatcher', 'fleet_manager'), validate(completeTripSchema), controller.complete);
router.post('/:id/cancel', requireRole('dispatcher', 'fleet_manager'), validate(cancelTripSchema), controller.cancel);

module.exports = router;
