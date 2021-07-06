const express = require('express');
const router = express.Router();
const { auth, isTokenValid } = require('../controllers/auth_controller');

router.post('/', auth);
router.get('/isTokenValid', isTokenValid);

module.exports = router;