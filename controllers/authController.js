import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { success, error } from '../utils/response.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json(error('Email and password required', -1));
    const user = await User.findOne({ email });
    if (!user) return res.json(error('User not found', -2));
    if (!user.isVerified) return res.json(error('User not verified', -3));
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json(error('Invalid credentials', -4));
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json(success('Login successful', { token, user: { id: user._id, email: user.email, role: user.role }}));
  } catch (err) {
    console.error(err);
    return res.json(error('Login failed'));
  }
};
