const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get mentor dashboard stats
// @route   GET /api/mentor/stats
// @access  Private (Mentor only)
const getMentorStats = async (req, res) => {
    try {
        // Get all courses by this mentor
        const courses = await Course.find({ mentorId: req.user._id });

        const totalCourses = courses.length;

        // Calculate total enrollments
        const totalEnrollments = courses.reduce((sum, course) => sum + course.totalEnrollments, 0);

        // Calculate total earnings
        const enrollments = await Enrollment.find({
            courseId: { $in: courses.map((c) => c._id) },
        }).populate('courseId', 'price');

        const totalEarnings = enrollments.reduce((sum, enrollment) => {
            return sum + (enrollment.courseId ? enrollment.courseId.price : 0);
        }, 0);

        // Get course-wise details
        const courseStats = courses.map((course) => ({
            id: course._id,
            title: course.title,
            enrollments: course.totalEnrollments,
            rating: course.averageRating,
            revenue: course.price * course.totalEnrollments,
        }));

        res.status(200).json({
            stats: {
                totalCourses,
                totalEnrollments,
                totalEarnings,
            },
            courseStats,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get mentor's courses
// @route   GET /api/mentor/courses
// @access  Private (Mentor only)
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ mentorId: req.user._id }).sort('-createdAt');

        res.status(200).json({
            count: courses.length,
            courses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get enrollments for a specific course
// @route   GET /api/mentor/courses/:courseId/enrollments
// @access  Private (Mentor only - own courses)
const getCourseEnrollments = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Verify course belongs to this mentor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.mentorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this course data' });
        }

        // Get all enrollments for this course
        const enrollments = await Enrollment.find({ courseId })
            .populate('studentId', 'name email')
            .sort('-purchaseDate');

        res.status(200).json({
            count: enrollments.length,
            enrollments: enrollments.map(e => ({
                id: e._id,
                student: {
                    id: e.studentId?._id,
                    name: e.studentId?.name,
                    email: e.studentId?.email,
                },
                purchaseDate: e.purchaseDate,
                paymentIntentId: e.paymentIntentId,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a specific course
// @route   GET /api/mentor/courses/:courseId/reviews
// @access  Private (Mentor only - own courses)
const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const Review = require('../models/Review');

        // Verify course belongs to this mentor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.mentorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this course data' });
        }

        // Get all reviews for this course
        const reviews = await Review.find({ courseId })
            .populate('studentId', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            count: reviews.length,
            reviews: reviews.map(r => ({
                id: r._id,
                student: {
                    id: r.studentId?._id,
                    name: r.studentId?.name,
                },
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMentorStats,
    getMyCourses,
    getCourseEnrollments,
    getCourseReviews,
};
