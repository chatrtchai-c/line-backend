const express = require('express');
const router = express.Router();
const webhookRoute = require('./webhook.route');
const leaveRoute = require('./leave.route');
const messageRoute = require('./message.route');

// Base API Path: /api/v1/webhook
router.use('/webhook', webhookRoute);
// Base API Path: /api/v1/leave
router.use('/leave', leaveRoute);
// Base API Path: /api/v1/message
router.use('/message', messageRoute);

module.exports = router;
