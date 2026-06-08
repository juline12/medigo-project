const Brand = require('../models/Brand');

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ createdAt: 1 });
    res.json(brands);
  } catch (error) {
    next(error);
  }
};

exports.createBrand = async (req, res, next) => {
  try {
    const { key, title, ar, fr, image } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({ message: 'Brand name must be at least 2 characters' });
    }

    if (!key || !/^[a-z0-9-_]+$/i.test(key)) {
      return res.status(400).json({ message: 'Brand key must contain only alphanumeric characters, dashes or underscores (no spaces)' });
    }

    if (!image || image.trim().length < 5) {
      return res.status(400).json({ message: 'Image URL is required and must be valid' });
    }

    // Check if key already exists
    const exists = await Brand.findOne({ key: key.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: 'Brand key already exists' });
    }

    const brand = await Brand.create({
      key: key.toLowerCase().trim(),
      title: title.trim(),
      ar: ar ? ar.trim() : '',
      fr: fr ? fr.trim() : '',
      image: image.trim()
    });

    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Prevent deleting default brands to avoid breaking UI layout
    const defaults = ['loreal', 'laroche', 'vichy', 'cerave', 'cetaphil'];
    if (defaults.includes(brand.key)) {
      return res.status(400).json({ message: 'Cannot delete default system brand' });
    }

    await Brand.findByIdAndDelete(id);
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    next(error);
  }
};
