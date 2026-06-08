const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: { type: String, required: true, minlength: 3 },
  phone: { type: String, required: true },
  filePath: { type: String, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending Review', 'Approved', 'Rejected'],
    default: 'Pending Review'
  },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
