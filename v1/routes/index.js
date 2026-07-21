const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example.controller');
const webhookRoute = require('./webhook.route');

/* GET */ 

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to API v1' });
});

router.get('/example', exampleController.getExample);

router.use('/webhook', webhookRoute);

module.exports = router;
