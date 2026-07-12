const express = require('express');
const controller = require('./expenses.controller');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { createExpenseSchema } = require('../../schemas/expense');

const router = express.Router();

router.use(requireAuth);

router.get('/', requireRole('fleet_manager', 'financial_analyst'), controller.list);
router.post('/', requireRole('financial_analyst', 'fleet_manager'), validate(createExpenseSchema), controller.create);

module.exports = router;
