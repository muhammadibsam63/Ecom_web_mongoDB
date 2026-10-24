import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerValidator,
  loginValidator,
  updatePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePasswordValidator, validate, updatePassword);
router.post('/forgotpassword', authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.put('/resetpassword/:resettoken', resetPasswordValidator, validate, resetPassword);
router.get('/verifyemail/:token', verifyEmail);

export default router;
