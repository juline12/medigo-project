const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { requireLogin } = require('../middlewares/auth');

router.post('/reminders', requireLogin, reminderController.createReminder);
router.get('/reminders', requireLogin, reminderController.getReminders);
router.delete('/reminders/:id', requireLogin, reminderController.deleteReminder);

module.exports = router;
