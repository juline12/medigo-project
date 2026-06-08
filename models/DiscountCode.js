const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('DiscountCode', discountCodeSchema);
