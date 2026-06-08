const path = require('path');
const Prescription = require('../models/Prescription');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createPrescription = async (req, res, next) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'Prescription file is required' });
    }

    const file = req.files.file;
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];

    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Only JPG, PNG, PDF allowed' });
    }

    const safeName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uploadPath = path.join(__dirname, '..', 'uploads', safeName);

    await file.mv(uploadPath);

    const prescription = await Prescription.create({
      user: req.session.user.id,
      patientName: req.body.patientName,
      phone: req.body.phone,
      notes: req.body.notes || '',
      filePath: '/uploads/' + safeName
    });

    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptions = async (req, res, next) => {
  try {
    const filter = req.session.user.role === 'admin' ? {} : { user: req.session.user.id };

    const list = await Prescription.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (error) {
    next(error);
  }
};

exports.updatePrescriptionStatus = async (req, res, next) => {
  try {
    const allowed = ['Pending Review', 'Approved', 'Rejected'];
    const status = allowed.includes(req.body.status) ? req.body.status : 'Pending Review';

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    next(error);
  }
};

exports.createOrderFromPrescription = async (req, res, next) => {
  try {
    const { items, address, mobile } = req.body;

    if (!items || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'Select at least one product' });
    }

    if (!address || address.trim().length < 5) {
      return res.status(400).json({ message: 'Address must be at least 5 characters' });
    }

    if (!/^01[0-2,5][0-9]{8}$/.test(mobile)) {
      return res.status(400).json({ message: 'Enter a valid Egyptian mobile number' });
    }

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      const qty = Number(item.qty || 1);

      if (!product || product.stock < qty) {
        return res.status(400).json({
          message: 'Invalid stock for ' + (product?.name || 'product')
        });
      }

      product.stock -= qty;
      await product.save();

      total += product.price * qty;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty
      });
    }

    const order = await Order.create({
      user: prescription.user,
      items: orderItems,
      total,
      address: address.trim(),
      mobile: mobile.trim(),
      paymentMethod: 'Cash'
    });

    prescription.status = 'Approved';
    await prescription.save();

    res.status(201).json({ message: 'Order created successfully from prescription!', order });
  } catch (error) {
    next(error);
  }
};
