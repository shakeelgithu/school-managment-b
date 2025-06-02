const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // yeh image URL hoga (cloud ya local path)
    required: false,
  },
  admissionNumber: {
    type: String,
    required: true,
    unique: true,
  },
  classAdmittedIn: {
    type: String,
    required: true,
  },
  dateOfAdmission: {
    type: Date,
    required: true,
  },
  currentClass: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);
