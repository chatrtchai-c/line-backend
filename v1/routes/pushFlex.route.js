const express = require('express');
const router = express.Router();
const pushFlexController = require('../controllers/pushFlex.controller');

router.post('/leave-stat', pushFlexController.pushLeaveStatFlex);

module.exports = router;
