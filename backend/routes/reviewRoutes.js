const express = require('express');
const {
    createReview,
    getCourseReviews,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public route
router.get('/:courseId', getCourseReviews);

// Student routes
router.post('/', protect, roleCheck('student'), createReview);
router.put('/:id', protect, roleCheck('student'), updateReview);

// Student or Admin can delete
router.delete('/:id', protect, roleCheck('student', 'admin'), deleteReview);

module.exports = router;
