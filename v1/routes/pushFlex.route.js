const express = require('express');
const router = express.Router();
const pushFlexController = require('../controllers/pushFlex.controller');

// POST /api/v1/push-flex/leave-stat
router.post('/leave-stat', pushFlexController.pushLeaveStatFlex);

module.exports = router;
