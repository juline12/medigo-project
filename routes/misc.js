const express = require('express');
const router = express.Router();
const miscController = require('../controllers/miscController');

router.get('/health', miscController.getHealth);
router.get('/drug-info', miscController.getDrugInfo);
router.get('/proxy-image', miscController.proxyImage);

module.exports = router;
