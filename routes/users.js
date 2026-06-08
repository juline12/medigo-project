const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAdmin } = require('../middlewares/auth');

router.get('/users', requireAdmin, userController.getUsers);
router.put('/users/:id/role', requireAdmin, userController.updateUserRole);
router.delete('/users/:id', requireAdmin, userController.deleteUser);

module.exports = router;
