const SupportMessage = require('../models/SupportMessage');

exports.createSupportMessage = async (req, res, next) => {
  try {
    const { message, supportId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let support;

    if (supportId) {
      support = await SupportMessage.findOne({
        _id: supportId,
        user: req.session.user.id
      });

      if (!support) {
        return res.status(404).json({ message: 'Support chat not found' });
      }

      support.messages.push({
        sender: 'user',
        text: message.trim()
      });

      support.status = 'Open';

      await support.save();
    } else {
      support = await SupportMessage.create({
        user: req.session.user.id,
        messages: [
          {
            sender: 'user',
            text: message.trim()
          }
        ],
        status: 'Open'
      });
    }

    res.status(201).json(support);
  } catch (error) {
    next(error);
  }
};

exports.getSupportMessages = async (req, res, next) => {
  try {
    const messages = await SupportMessage.find({
      user: req.session.user.id,
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

exports.updateSupportMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 1) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const support = await SupportMessage.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      {
        $set: { status: 'Open' },
        $push: { messages: { sender: 'user', text: message } }
      },
      { new: true }
    );

    res.json(support);
  } catch (error) {
    next(error);
  }
};

exports.getAdminSupportMessages = async (req, res, next) => {
  try {
    const messages = await SupportMessage.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

exports.replySupportMessage = async (req, res, next) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: 'Reply is required' });
    }

    const support = await SupportMessage.findById(req.params.id);

    if (!support) {
      return res.status(404).json({ message: 'Support message not found' });
    }

    support.messages.push({
      sender: 'admin',
      text: reply.trim()
    });

    support.reply = reply.trim();
    support.status = 'Replied';

    await support.save();

    res.json(support);
  } catch (error) {
    next(error);
  }
};
