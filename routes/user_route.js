const express = require('express');
const router = express.Router();
const { checkRole, list } = require('../controllers/user_controller');
const { checkToken } = require('../controllers/auth_controller');

router.get('/', checkToken, checkRole, list);

module.exports = router;