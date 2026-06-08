const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { requireLogin, requireAdmin } = require('../middlewares/auth');

router.post('/support', requireLogin, supportController.createSupportMessage);
router.get('/support', requireLogin, supportController.getSupportMessages);
router.put('/support/:id/message', requireLogin, supportController.updateSupportMessage);
router.get('/admin/support', requireAdmin, supportController.getAdminSupportMessages);
router.put('/admin/support/:id/reply', requireAdmin, supportController.replySupportMessage);

module.exports = router;
