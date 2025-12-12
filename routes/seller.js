import express from 'express';
import { updateItems } from '../controllers/sellerController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/AddOrUpdateItems', verifyToken, updateItems);

export default router;
