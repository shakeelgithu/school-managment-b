const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db");
const dotenv = require("dotenv");
const authRoutes = require("../routes/authRoutes");
const studentRoutes = require("../routes/studentRoutes");
const protectedRoutes = require('../routes/protectedRoute');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // change to your frontend URL after deployment
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use('/api', protectedRoutes);

// Export for Vercel serverless
module.exports = app;
