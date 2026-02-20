const express = require('express');
const {
    getMentorStats,
    getMyCourses,
    getCourseEnrollments,
    getCourseReviews
} = require('../controllers/mentorController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Mentor-only routes
router.get('/stats', protect, roleCheck('mentor'), getMentorStats);
router.get('/courses', protect, roleCheck('mentor'), getMyCourses);
router.get('/courses/:courseId/enrollments', protect, roleCheck('mentor'), getCourseEnrollments);
router.get('/courses/:courseId/reviews', protect, roleCheck('mentor'), getCourseReviews);

module.exports = router;
