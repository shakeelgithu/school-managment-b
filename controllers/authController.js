const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");


exports.register = async (req, res) => {
  try {
    // Accept both "fullName" (frontend) and "name" (fallback)
    const { fullName, name, email, password } = req.body;
    const userName = fullName || name;

    if (!userName || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: userName, email, password: hashedPassword });

    res.status(201).json({ msg: "Registered successfully", user: { id: user._id, name: userName, email } });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    console.log("User found:", user._id);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    res.json({ msg: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login Controller Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry: expiry },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ msg: "Email and OTP are required" });

    const user = await User.findOne({ email, otp });
    if (!user) return res.status(400).json({ msg: "Invalid OTP" });

    if (user.otpExpiry < Date.now()) return res.status(400).json({ msg: "OTP expired" });

    res.json({ msg: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email, otp });
    if (!user) return res.status(400).json({ msg: "Invalid OTP or email" });

    if (user.otpExpiry < Date.now()) return res.status(400).json({ msg: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};