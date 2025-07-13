const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register with OTP
exports.register = async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = new User({
    email,
    password: hashedPassword,
    otp,
    otpExpires: Date.now() + 10 * 60 * 1000,
  });

  await user.save();

  await transporter.sendMail({
    to: email,
    subject: 'Verify your Email',
    text: `Your OTP code is ${otp}`,
  });

  res.json({ msg: 'OTP sent to email' });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'User not found' });

  if (user.otp !== otp || user.otpExpires < Date.now())
    return res.status(400).json({ msg: 'Invalid or expired OTP' });

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ msg: 'Email verified successfully' });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ msg: 'Invalid credentials' });

  if (!user.isVerified)
    return res.status(400).json({ msg: 'Please verify your email first' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({ token, userId: user._id, email: user.email });
};
