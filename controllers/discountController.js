const DiscountCode = require('../models/DiscountCode');

exports.getDiscountCode = async (req, res, next) => {
  try {
    const dc = await DiscountCode.findOne({});
    res.json({ discountCode: dc || null });
  } catch (error) {
    next(error);
  }
};

exports.setDiscountCode = async (req, res, next) => {
  try {
    const { code, discountPercent } = req.body;

    if (!code || !code.trim()) {
      await DiscountCode.deleteMany({});
      return res.json({ message: 'Discount code cleared successfully', discountCode: null });
    }

    const pct = Number(discountPercent) || 10;
    if (pct < 1 || pct > 100) {
      return res.status(400).json({ message: 'Discount percentage must be between 1 and 100' });
    }

    await DiscountCode.deleteMany({});
    const dc = await DiscountCode.create({
      code: code.trim().toUpperCase(),
      discountPercent: pct
    });

    res.json({ message: 'Discount code set successfully', discountCode: dc });
  } catch (error) {
    next(error);
  }
};
