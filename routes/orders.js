const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireLogin, requireAdmin } = require('../middlewares/auth');

router.post('/orders', requireLogin, orderController.createOrder);
router.get('/orders', requireLogin, orderController.getOrders);
router.put('/orders/:id/status', requireAdmin, orderController.updateOrderStatus);
router.put('/orders/:id/rate', requireLogin, orderController.rateOrder);

module.exports = router;
