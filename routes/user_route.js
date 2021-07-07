const express = require('express');
const router = express.Router();
const { checkRole, list, deleteById, putById, registerUser } = require('../controllers/user_controller');
const { checkToken } = require('../controllers/auth_controller');

router.get('/', checkToken, checkRole, list);
router.post('/', checkToken, checkRole, registerUser);
router.delete('/:id', checkToken, checkRole, deleteById);
router.put('/:id', checkToken, checkRole, putById);

module.exports = router;