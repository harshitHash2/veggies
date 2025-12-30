import express from 'express';
import { getSellerItems, updateItems } from '../controllers/sellerController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/AddOrUpdateItems', verifyToken, updateItems);
router.get('/GetSellerItems', verifyToken, getSellerItems);

export default router;
