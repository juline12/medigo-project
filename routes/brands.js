const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { requireAdmin } = require('../middlewares/auth');

router.get('/brands', brandController.getBrands);
router.post('/brands', requireAdmin, brandController.createBrand);
router.delete('/brands/:id', requireAdmin, brandController.deleteBrand);

module.exports = router;
