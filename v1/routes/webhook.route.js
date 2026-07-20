const express = require('express');
const router = express.Router();
const line = require('@line/bot-sdk');
const webhookController = require('../controllers/webhook.controller');

// GET /api/v1/webhook (optional, for testing if the endpoint is up)
router.get('/', (req, res) => {
  res.send('Webhook is ready!');
});

// POST /api/v1/webhook
// We apply line.middleware BEFORE reaching the controller
// The middleware will validate the signature and parse the raw body
router.post('/', line.middleware(webhookController.config), webhookController.handleWebhook);

module.exports = router;
