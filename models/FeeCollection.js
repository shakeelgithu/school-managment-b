const mongoose = require('mongoose');

const feeCollectionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  paidOn: { type: Date, default: Date.now },
  receivedBy: { type: String },
  note: { type: String },
  status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('FeeCollection', feeCollectionSchema);