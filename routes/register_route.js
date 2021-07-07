const express = require('express');
const router = express.Router();
const { checkRole, registerUser } = require('../controllers/user_controller');
const { checkToken } = require('../controllers/auth_controller');

router.post('/', checkToken, checkRole, registerUser);

module.exports = router;