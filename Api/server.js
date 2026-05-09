require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("../config/db");
const dotenv = require("dotenv");

const authRoutes = require("../routes/authRoutes");
const studentRoutes = require("../routes/studentRoutes");
const feeRoutes = require("../routes/feeRoutes");
const protectedRoutes = require("../routes/protectedRoute");
const feeRoutes = require('../routes/feeRoutes');
const financeRoutes = require('../routes/financeRoutes');

dotenv.config();

// Connect Database
connectDB();

const app = express();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads folder created');
}
// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://school-management-frontend.vercel.app"
    ],
    credentials: true,
  })
);

// Test Route
app.get("/", (req, res) => {
  res.send("School Management API Running...");
});

app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", protectedRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/finance', financeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;