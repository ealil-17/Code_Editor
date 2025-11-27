const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// Execute code
router.post('/execute', codeController.executeCode);

// Get boilerplate code for a language
router.get('/boilerplate/:language', codeController.getBoilerplate);

module.exports = router;
