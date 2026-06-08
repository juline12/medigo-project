const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAdmin } = require('../middlewares/auth');

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProduct);
router.post('/products', requireAdmin, productController.createProduct);
router.put('/products/:id', requireAdmin, productController.updateProduct);
router.delete('/products/:id', requireAdmin, productController.deleteProduct);
router.post('/notify', productController.subscribeNotify);

module.exports = router;
