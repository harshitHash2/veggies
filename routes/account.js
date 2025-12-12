import express from 'express';
import { signup, updateLocation, verifyotp, forgotPassword, resendOtp, resetPassword } from '../controllers/accountController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/updatelocation', verifyToken, updateLocation);
router.post('/verifyotp', verifyotp);
router.post('/forgot-password', forgotPassword);
router.post('/resend-otp', resendOtp);
router.post('/reset-password', resetPassword);

export default router;
