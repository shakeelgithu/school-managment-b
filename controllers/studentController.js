const Student = require("../models/Student");

// Create Student
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      admissionNumber,
      classAdmittedIn,
      dateOfAdmission,
      currentClass,
      dateOfBirth,
      address,
    } = req.body;

    const studentData = {
      name,
      fatherName,
      admissionNumber,
      classAdmittedIn,
      dateOfAdmission: dateOfAdmission ? new Date(dateOfAdmission) : null,
      currentClass,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      address,
    };

    if (req.file) {
      studentData.photo = req.file.filename; // ✅ saved by multer
    }

    const student = await Student.create(studentData);

    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    console.error("Error in createStudent:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

// Get Single Student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student", error: error.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated", updated });
  } catch (error) {
    res.status(400).json({ message: "Failed to update student", error: error.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
};
