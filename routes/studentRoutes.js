const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

const multer = require("multer");

// Setup storage destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ✅ make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ✅ POST route WITH multer middleware
router.post("/", upload.single("photo"), studentController.createStudent);

// ✅ other routes
router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudentById);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
