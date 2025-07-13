const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
