const express = require('express');
const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getPopularCourses,
} = require('../controllers/courseController');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/popular/list', getPopularCourses);
router.get('/:id', getCourseById);

// Mentor routes
router.post(
    '/',
    protect,
    roleCheck('mentor'),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]),
    createCourse
);

router.put(
    '/:id',
    protect,
    roleCheck('mentor'),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]),
    updateCourse
);

// Mentor or Admin can delete
router.delete('/:id', protect, roleCheck('mentor', 'admin'), deleteCourse);

module.exports = router;
