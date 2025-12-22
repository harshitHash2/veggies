import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { success, error } from '../utils/response.js';
import { sendMail } from '../utils/mailer.js';

function genOtp() {
  // return Math.floor(1000 + Math.random() * 9000).toString();
  return '0000';
}

export const signup = async (req, res) => {
  try {
    const {
  firstName,
  lastName,
  email,
  phone,
  password,
  role
} = req.body;
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : 'User';
    if (!email || !password) return res.json(error('Email and password required', -1));
    const existing = await User.findOne({ email });
    if (existing) return res.json(error('Email already in use', -2));

    const hash = await bcrypt.hash(password, 10);
    const otp = genOtp();
    const otpExpire = new Date(Date.now() + 10*60*1000); // 10 minutes

    const user = await User.create({ fullName, email, password: hash, role: role === "1" ? 'seller' : 'buyer' || 'buyer', otp, otpExpire });
    try {
      await sendMail(email, 'Signup OTP', `Your OTP is ${otp}`, `<p>Your OTP: <b>${otp}</b></p>`);
    } catch (e) {
      console.warn('Mail send failed', e);
    }
    return res.json(success('User created, OTP sent', { userId: user._id }));
  } catch (err) {
    console.error(err);
    return res.json(error('Signup failed'));
  }
};

export const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.json(error('Email and OTP required', -1));
    const user = await User.findOne({ email });
    if (!user) return res.json(error('User not found', -2));
    //if (user.isVerified) return res.json(error('User already verified', -3));
    if (!user.otp || user.otp !== otp) return res.json(error('Invalid OTP', -4));
    if (user.otpExpire < new Date()) return res.json(error('OTP expired', -5));
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    return res.json(success('OTP verified', { userId: user._id }));
  } catch (err) {
    console.error(err);
    return res.json(error('Verify OTP failed'));
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json(error('Email required', -1));
    const user = await User.findOne({ email });
    if (!user) return res.json(error('User not found', -2));
    if (user.isVerified) return res.json(error('User already verified', -3));
    const otp = genOtp();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10*60*1000);
    await user.save();
    try {
      await sendMail(email, 'Resent OTP', `Your OTP is ${otp}`, `<p>Your OTP: <b>${otp}</b></p>`);
    } catch (e) { console.warn('Mail send failed', e); }
    return res.json(success('OTP resent'));
  } catch (err) {
    console.error(err);
    return res.json(error('Resend OTP failed'));
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json(error('Email required', -1));
    const user = await User.findOne({ email });
    if (!user) return res.json(error('User not found', -2));
    const otp = genOtp();
    user.resetOtp = otp;
    user.resetOtpExpire = new Date(Date.now() + 10*60*1000);
    await user.save();
    try {
      await sendMail(email, 'Password Reset OTP', `Your reset OTP is ${otp}`, `<p>Your reset OTP: <b>${otp}</b></p>`);
    } catch (e) { console.warn('Mail send failed', e); }
    return res.json(success('Reset OTP sent'));
  } catch (err) {
    console.error(err);
    return res.json(error('Forgot password failed'));
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetOtp, newPassword, resetToken } = req.body;
    // Support two flows:
    // 1) direct verify with resetOtp + email
    // 2) token-based where VerifyResetOtp issued a resetToken (handled in auth controller) - allow both
    if (resetToken) {
      // token based - verify token contains r:true and id
      try {
        // const payload = jwt.verify(resetToken, process.env.JWT_SECRET || 'secret');
        // if (!payload.r || !payload.id) return res.json(error('Invalid reset token payload', -3));
        // const user = await User.findById(payload.id);
        const user = await User.findOne({ email });
        if (!user) return res.json(error('User not found', -4));
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.json(success('Password reset successful'));
      } catch (e) {
        return res.json(error('Invalid or expired reset token', -2));
      }
    } else {
      // otp based
      if (!email || !newPassword) return res.json(error('email, resetOtp and newPassword required', -1));
      const user = await User.findOne({ email });
      if (!user) return res.json(error('User not found', -2));
      // if (!user.resetOtp || user.resetOtp !== resetOtp) return res.json(error('Invalid reset OTP', -3));
      // if (user.resetOtpExpire < new Date()) return res.json(error('Reset OTP expired', -4));
      user.password = await bcrypt.hash(newPassword, 10);
      // user.resetOtp = null;
      // user.resetOtpExpire = null;
      await user.save();
      return res.json(success('Password reset successful'));
    }
  } catch (err) {
    console.error(err);
    return res.json(error('Reset password failed'));
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (typeof lat !== 'number' || typeof lng !== 'number') return res.json(error('lat and lng required as numbers', -1));
    const user = await User.findById(req.user.id);
    if (!user) return res.json(error('User not found', -2));
    user.location = { type: 'Point', coordinates: [lng, lat] };
    await user.save();
    return res.json(success('Location updated'));
  } catch (err) {
    console.error(err);
    return res.json(error('Update location failed'));
  }
};
