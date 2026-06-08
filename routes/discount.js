const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { requireAdmin } = require('../middlewares/auth');

router.get('/discount-code', discountController.getDiscountCode);
router.post('/admin/discount-code', requireAdmin, discountController.setDiscountCode);

module.exports = router;
