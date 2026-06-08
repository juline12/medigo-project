const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { key, title, ar, fr, icon, sub } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({ message: 'Category name must be at least 2 characters' });
    }

    if (!key || !/^[a-z0-9-_]+$/i.test(key)) {
      return res.status(400).json({ message: 'Category key must contain only alphanumeric characters, dashes or underscores (no spaces)' });
    }

    // Check if key already exists
    const exists = await Category.findOne({ key: key.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: 'Category key already exists' });
    }

    const category = await Category.create({
      key: key.toLowerCase().trim(),
      title: title.trim(),
      ar: ar ? ar.trim() : '',
      fr: fr ? fr.trim() : '',
      icon: icon ? icon.trim() : '🏷️',
      sub: sub ? sub.trim() : ''
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Prevent deleting default categories to avoid breaking UI layout
    const defaults = ['pain', 'vitamins', 'skin', 'baby', 'cold', 'hair', 'beauty'];
    if (defaults.includes(category.key)) {
      return res.status(400).json({ message: 'Cannot delete default category' });
    }

    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
