const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Utilities', 'Supplies', 'Maintenance', 'Miscellaneous', 'Other'],
    required: true
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  paidTo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);