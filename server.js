const express = require("express");
const cors = require("cors"); // npm install cors
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200', // Angular development server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));