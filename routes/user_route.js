const express = require('express');
const router = express.Router();
const { checkRole, list, deleteById } = require('../controllers/user_controller');
const { checkToken } = require('../controllers/auth_controller');

router.get('/', checkToken, checkRole, list);
router.delete('/delete/:id', checkToken, checkRole, deleteById);

module.exports = router;