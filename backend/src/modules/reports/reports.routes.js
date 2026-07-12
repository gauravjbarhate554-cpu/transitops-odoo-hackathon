const express = require('express');
const controller = require('./reports.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');

const router = express.Router();

router.use(requireAuth);

router.get('/vehicles', requireRole('fleet_manager', 'financial_analyst'), controller.vehicleAnalytics);
router.get('/vehicles.csv', requireRole('fleet_manager', 'financial_analyst'), controller.vehicleAnalyticsCsv);
router.get('/license-alerts', requireRole('fleet_manager', 'safety_officer'), controller.licenseAlerts);

module.exports = router;
