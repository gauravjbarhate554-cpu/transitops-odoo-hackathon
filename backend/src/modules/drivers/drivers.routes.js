const express = require('express');
const controller = require('./drivers.controller');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { createDriverSchema, updateDriverSchema } = require('../../schemas/driver');

const router = express.Router();

router.use(requireAuth);

router.get('/available', requireRole('dispatcher', 'fleet_manager'), controller.listAvailable);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', requireRole('safety_officer', 'fleet_manager'), validate(createDriverSchema), controller.create);
router.patch('/:id', requireRole('safety_officer', 'fleet_manager'), validate(updateDriverSchema), controller.update);
router.post('/:id/suspend', requireRole('safety_officer'), controller.suspend);
router.post('/:id/reinstate', requireRole('safety_officer'), controller.reinstate);
router.post('/:id/off-duty', requireRole('safety_officer', 'fleet_manager'), controller.offDuty);
router.post('/:id/on-duty', requireRole('safety_officer', 'fleet_manager'), controller.onDuty);

module.exports = router;
