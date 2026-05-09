require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("../config/db");

const authRoutes = require("../routes/authRoutes");
const studentRoutes = require("../routes/studentRoutes");
const feeRoutes = require("../routes/feeRoutes");
const protectedRoutes = require("../routes/protectedRoute");
const financeRoutes = require('../routes/financeRoutes');

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:4200",
    "https://school-system-plum.vercel.app"  // ← your actual frontend URL
  ],
  credentials: true,
}));

// Uploads folder
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Routes
app.get("/", (req, res) => {
  res.send("School Management API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", protectedRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/finance', financeRoutes);

// ✅ Only listen locally — Vercel handles this in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;