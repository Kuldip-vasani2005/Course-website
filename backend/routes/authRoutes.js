const express = require('express');
const { register, verifyOTP, login, getMe, updateDetails, requestPasswordReset, verifyPasswordResetOTP, resetPassword, updateProfile } = require('../controllers/authController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/request-password-reset', requestPasswordReset);
router.post('/verify-password-reset-otp', verifyPasswordResetOTP);
router.post('/reset-password', resetPassword);
router.put('/update-profile', protect, updateProfile)


module.exports = router;
