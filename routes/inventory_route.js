const express = require('express');
const router = express.Router();
const { create, list, deleteById, putById, getById } = require('../controllers/inventory_controller');
const { checkToken } = require('../controllers/auth_controller');

router.get('/', checkToken, list);
router.get('/:id', checkToken, getById);
router.post('/', checkToken, create);
router.delete('/:id', checkToken, deleteById);
router.put('/:id', checkToken, putById);

module.exports = router;