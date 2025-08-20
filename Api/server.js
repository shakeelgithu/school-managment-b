const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db");
const dotenv = require("dotenv");
const authRoutes = require("../routes/authRoutes");
const studentRoutes = require("../routes/studentRoutes");
const protectedRoutes = require("../routes/protectedRoute");

dotenv.config();
connectDB();

const app = express();

// ✅ Update CORS to allow your deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:4200", // for local dev
      "https://school-management-frontend.vercel.app" // replace with your frontend Vercel URL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", protectedRoutes);

// ✅ Export for Vercel serverless
module.exports = app;
