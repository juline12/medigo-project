const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  ar: { type: String, default: '' },
  fr: { type: String, default: '' },
  icon: { type: String, default: '🏷️' },
  sub: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
