const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: Number
  }],

  total: { type: Number, required: true },

  address: { type: String, required: true, minlength: 5 },

  mobile: {
    type: String,
    required: true,
    match: /^01[0-2,5][0-9]{8}$/
  },

  paymentMethod: {
    type: String,
    enum: ['Cash', 'Visa'],
    required: true
  },
  cardInfo: {
    cardHolder: String,
    last4: String,
    cardExpiry: String
  },
  discountCode: { type: String, default: '' },
  discountPercent: { type: Number, default: 0 },
  redeemedPoints: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingComment: { type: String, default: '' },
  status: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
