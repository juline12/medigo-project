const Reminder = require('../models/Reminder');

exports.createReminder = async (req, res, next) => {
  try {
    const { medicineName, times, frequency } = req.body;

    if (!medicineName || medicineName.trim().length < 2) {
      return res.status(400).json({
        message: 'Medicine name is required'
      });
    }

    if (!times || !Array.isArray(times) || !times.length) {
      return res.status(400).json({
        message: 'Reminder time is required'
      });
    }

    const createdReminders = [];

    for (const time of times) {
      const reminder = await Reminder.create({
        user: req.session.user.id,
        medicineName,
        time,
        frequency
      });

      createdReminders.push(reminder);
    }

    res.status(201).json(createdReminders);
  } catch (error) {
    next(error);
  }
};

exports.getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({
      user: req.session.user.id
    }).sort({ createdAt: -1 });

    res.json(reminders);
  } catch (error) {
    next(error);
  }
};

exports.deleteReminder = async (req, res, next) => {
  try {
    await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user.id
    });

    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    next(error);
  }
};
