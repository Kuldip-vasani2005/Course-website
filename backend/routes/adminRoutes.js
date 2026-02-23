const express = require('express');
const {
    getAdminStats,
    getAllUsers,
    deleteUser,
    getAllCourses,
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Admin-only routes
router.get('/stats', protect, roleCheck('admin'), getAdminStats);
router.get('/users', protect, roleCheck('admin'), getAllUsers);
router.delete('/users/:id', protect, roleCheck('admin'), deleteUser);
router.get('/courses', protect, roleCheck('admin'), getAllCourses);

module.exports = router;
