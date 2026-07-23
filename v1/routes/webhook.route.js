const express = require('express');
const router = express.Router();
const line = require('@line/bot-sdk');
const webhookController = require('../controllers/webhook.controller');

router.get('/', (req, res) => {
  res.send('Webhook is ready!');
});

router.post('/', line.middleware(webhookController.config), webhookController.handleWebhook);

module.exports = router;
