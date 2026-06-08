const bcrypt = require('bcryptjs');
const User = require('../models/User');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.getMe = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.json({ user: null });
    }
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.json({ user: null });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: 'Name must be at least 3 characters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });

    if (exists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone || '',
      password: await bcrypt.hash(password, 10),
      role: 'user'
    });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      message: 'Account created successfully',
      user: req.session.user
    });
  } catch (error) {
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      message: 'Signed in successfully',
      user: req.session.user
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
};
