import jwt from 'jsonwebtoken';
import { error } from '../utils/response.js';

export const verifyToken = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.json(error('Authorization header required', -1));
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.json(error('Invalid authorization header', -2));
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    return res.json(error('Invalid or expired token', -3));
  }
};
