const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireLogin } = require('../middlewares/auth');

router.post('/ai/chat', aiController.chat);
router.post('/ai/health-score', requireLogin, aiController.healthScore);

module.exports = router;
