const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

// API Path: POST /api/v1/message/push-text
router.post('/push-text', messageController.pushMessage);

// API Path: POST /api/v1/message/push-image
router.post('/push-image', messageController.pushImage);

// API Path: POST /api/v1/message/push-flex
router.post('/push-flex', messageController.pushFlex);

module.exports = router;


