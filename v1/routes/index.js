const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example.controller');

// GET /api/v1/
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to API v1' });
});

// GET /api/v1/example
router.get('/example', exampleController.getExample);

module.exports = router;
