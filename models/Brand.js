const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, lowercase: true },
  title: { type: String, required: true },
  ar: { type: String, default: '' },
  fr: { type: String, default: '' },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
