
const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },

    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },

    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
    },

    className: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },

    totalFee: {
      type: Number,
      required: [true, 'Total fee is required'],
      min: [0, 'Total fee cannot be negative'],
    },

    submittedFee: {
      type: Number,
      default: 0,
      min: [0, 'Submitted fee cannot be negative'],
    },

    feePeriod: {
      type: String,
      required: [true, 'Fee period is required'],
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

feeSchema.virtual('pendingDues').get(function () {
  return Math.max(0, this.totalFee - this.submittedFee);
});

feeSchema.virtual('status').get(function () {
  return this.submittedFee >= this.totalFee ? 'Complete' : 'Pending';
});


feeSchema.pre('save', function (next) {
  if (this.submittedFee > this.totalFee) {
    return next(
      new Error('Submitted fee cannot exceed total fee')
    );
  }
  next();
});

feeSchema.index({ student: 1, feePeriod: 1 });

module.exports = mongoose.model('Fee', feeSchema);