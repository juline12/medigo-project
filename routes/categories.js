const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireAdmin } = require('../middlewares/auth');

router.get('/categories', categoryController.getCategories);
router.post('/categories', requireAdmin, categoryController.createCategory);
router.delete('/categories/:id', requireAdmin, categoryController.deleteCategory);

module.exports = router;
