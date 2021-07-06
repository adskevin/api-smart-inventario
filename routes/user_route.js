const express = require('express');
const router = express.Router();
const { validateField } = require('../controllers/user_controller');

router.get('/validateField', validateField);

module.exports = router;