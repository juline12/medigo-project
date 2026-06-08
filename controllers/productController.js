const nodemailer = require('nodemailer');
const Product = require('../models/Product');
const Notify = require('../models/Notify');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: (process.env.EMAIL_USER || '').trim(),
    pass: (process.env.EMAIL_PASS || '').trim().replace(/\s/g, '')
  }
});

function validateProduct(body) {
  const errors = [];

  if (!body.name || body.name.trim().length < 3) {
    errors.push('Product name must be at least 3 characters');
  }

  if (!body.brand || body.brand.trim().length < 2) {
    errors.push('Brand is required');
  }

  if (!body.category) {
    errors.push('Category is required');
  }

  if (!body.price || Number(body.price) < 1) {
    errors.push('Price must be at least 1');
  }

  if (body.stock === undefined || Number(body.stock) < 0) {
    errors.push('Stock must be 0 or more');
  }

  return errors;
}

exports.getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '100'), 1), 200);
    const q = req.query.q ? String(req.query.q).trim() : '';
    const category = req.query.category || 'all';
    const brand = req.query.brand || 'all';

    const filter = {};

    if (q) {
      const words = q.split(/\s+/).filter(Boolean);
      filter.$and = words.map(word => {
        const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Handle Loreal/L'Oreal/L'Oréal flexibly
        const normalizedWord = escapedWord
          .replace(/[eéèêë]/gi, '[eéèêë]')
          .replace(/[aàâä]/gi, '[aàâä]')
          .replace(/[iìîï]/gi, '[iìîï]')
          .replace(/[oòôö]/gi, '[oòôö]')
          .replace(/[uùûü]/gi, '[uùûü]')
          .replace(/['’‘]/g, "['’‘]?") // If apostrophe is in query, make it optional
          .replace(/([a-z])(?=[a-z])/gi, "$1['’‘]?"); // Also allow optional apostrophe between any letters
          
        return {
          $or: [
            { name: new RegExp(normalizedWord, 'i') },
            { brand: new RegExp(normalizedWord, 'i') }
          ]
        };
      });
    }

    if (category !== 'all') {
      filter.category = category;
    }

    if (brand !== 'all') {
      // Normalize apostrophes and handle spaces flexibly
      const normalizedBrand = brand
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        .replace(/[eéèêë]/gi, '[eéèêë]')
        .replace(/['’‘]/g, "['’‘]?")
        .replace(/([a-z])(?=[a-z])/gi, "$1['’‘]?")
        .replace(/\s+/g, '.*');
      
      filter.brand = new RegExp(normalizedBrand, 'i');
    }

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit) || 1,
      total
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);

    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const product = await Product.create({
      name: req.body.name.trim(),
      brand: req.body.brand.trim(),
      category: req.body.category,
      price: Number(req.body.price),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : null,
      stock: Number(req.body.stock),
      badge: req.body.badge || '',
      image: req.body.image || undefined
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);

    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const oldProduct = await Product.findById(req.params.id);

    if (!oldProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (Number(oldProduct.stock) <= 0 && Number(product.stock) > 0) {
      console.log('STOCK BACK:', product.name);

      const notifyList = await Notify.find({
        productId: product._id,
        notified: false
      });

      console.log('NOTIFY LIST:', notifyList);

      for (const notify of notifyList) {
        try {
          await transporter.sendMail({
            from: `"MediGo Pharmacy" <${process.env.EMAIL_USER}>`,
            to: notify.email,
            subject: `MediGo - Product Available Again`,
            text: `Good news! ${product.name} is now available again in MediGo. You can order it now.`
          });

          console.log('EMAIL SENT TO:', notify.email);

          notify.notified = true;
          await notify.save();
        } catch (emailError) {
          console.log('EMAIL ERROR:', emailError.message);
        }
      }
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

exports.subscribeNotify = async (req, res, next) => {
  try {
    const { productId, productName, email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email address'
      });
    }

    if (!productId || !email) {
      return res.status(400).json({ message: 'Product and email are required' });
    }

    const exists = await Notify.findOne({
      productId,
      email,
      notified: false
    });

    if (exists) {
      return res.json({ message: 'You are already subscribed for this product' });
    }

    const notify = await Notify.create({
      productId,
      productName,
      email,
      notified: false
    });

    res.status(201).json({
      message: 'We will email you when this product is back in stock',
      notify
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};
