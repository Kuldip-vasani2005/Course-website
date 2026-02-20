const express = require('express');
const {
    createCheckoutSession,
    verifySession,
    createPaymentIntent,
    confirmPayment,
    getMyEnrollments,
    checkEnrollment,
} = require('../controllers/enrollmentController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Student routes
// Checkout Session (redirect to Stripe)
router.post('/checkout', protect, roleCheck('student'), createCheckoutSession);
router.post('/verify-session', protect, roleCheck('student'), verifySession);

// Payment Intent (on-site payment)
router.post('/create-payment-intent', protect, roleCheck('student'), createPaymentIntent);
router.post('/confirm-payment', protect, roleCheck('student'), confirmPayment);
router.get('/my-courses', protect, roleCheck('student'), getMyEnrollments);
router.get('/check/:courseId', protect, roleCheck('student'), checkEnrollment);

module.exports = router;
