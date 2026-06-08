const Order = require('../models/Order');
const Product = require('../models/Product');
const DiscountCode = require('../models/DiscountCode');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, address, mobile, paymentMethod, cardInfo, discountCode, usePoints } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!address || address.trim().length < 5) {
      return res.status(400).json({ message: 'Address must be at least 5 characters' });
    }

    if (!/^01[0-2,5][0-9]{8}$/.test(mobile)) {
      return res.status(400).json({ message: 'Enter valid Egyptian mobile number' });
    }

    if (!['Cash', 'Visa'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Choose Cash or Visa' });
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

    let finalTotal = total;
    let appliedDiscountPercent = 0;
    if (discountCode) {
      const dc = await DiscountCode.findOne({ code: discountCode.trim().toUpperCase() });
      if (dc) {
        appliedDiscountPercent = dc.discountPercent;
        finalTotal = total - (total * (dc.discountPercent / 100));
      }
    }

    const User = require('../models/User');
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let pointsToRedeem = 0;
    if (usePoints && user.points >= 100) {
      pointsToRedeem = Math.min(user.points, Math.floor(finalTotal));
      finalTotal -= pointsToRedeem;
      user.points = user.points - pointsToRedeem + 10;
    } else {
      user.points += 10;
    }
    await user.save();

    const order = await Order.create({
      user: req.session.user.id,
      items: orderItems,
      total: finalTotal,
      address,
      mobile,
      paymentMethod,
      cardInfo,
      discountCode: discountCode ? discountCode.trim().toUpperCase() : undefined,
      discountPercent: appliedDiscountPercent > 0 ? appliedDiscountPercent : undefined,
      redeemedPoints: pointsToRedeem > 0 ? pointsToRedeem : undefined
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const filter = req.session.user.role === 'admin'
      ? {}
      : { user: req.session.user.id };

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.rateOrder = async (req, res, next) => {
  try {
    const { rating, ratingComment } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { rating: Number(rating), ratingComment: (ratingComment || '').trim() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Thank you for your rating!', order });
  } catch (error) {
    next(error);
  }
};
