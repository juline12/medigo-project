const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { requireLogin, requireAdmin } = require('../middlewares/auth');

router.post('/prescriptions', requireLogin, prescriptionController.createPrescription);
router.get('/prescriptions', requireLogin, prescriptionController.getPrescriptions);
router.put('/prescriptions/:id/status', requireAdmin, prescriptionController.updatePrescriptionStatus);
router.post('/admin/prescriptions/:id/create-order', requireAdmin, prescriptionController.createOrderFromPrescription);

module.exports = router;
