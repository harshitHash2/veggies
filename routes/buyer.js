import express from 'express';
import { nearbyStores } from '../controllers/buyerController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/nearbySellar/:productId', verifyToken, nearbyStores);

export default router;
