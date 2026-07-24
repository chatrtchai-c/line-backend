const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');

// API Path: POST /api/v1/leave/push-stat
router.post('/push-stat', leaveController.pushLeaveStatFlex);

module.exports = router;
