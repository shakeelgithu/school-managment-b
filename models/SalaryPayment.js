const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  month: { type: String, required: true },  
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  advance: { type: Number, default: 0 },     
  deduction: { type: Number, default: 0 },
  netPaid: { type: Number, required: true },
  paidOn: { type: Date, default: Date.now },
  note: { type: String },
  status: { type: String, enum: ['Paid', 'Advance', 'Pending'], default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);