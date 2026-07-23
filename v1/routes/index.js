const express = require('express');
const router = express.Router();
const webhookRoute = require('./webhook.route');
const pushFlexRoute = require('./pushFlex.route');

router.use('/webhook', webhookRoute);
router.use('/push-flex', pushFlexRoute);

module.exports = router;
