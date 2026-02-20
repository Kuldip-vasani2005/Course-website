const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { deleteFile } = require('../utils/cloudinaryUpload');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalMentors = await User.countDocuments({ role: 'mentor' });
        const totalCourses = await Course.countDocuments();

        // Calculate total revenue
        const enrollments = await Enrollment.find().populate('courseId', 'price');
        const totalRevenue = enrollments.reduce((sum, enrollment) => {
            return sum + (enrollment.courseId ? enrollment.courseId.price : 0);
        }, 0);

        res.status(200).json({
            stats: {
                totalStudents,
                totalMentors,
                totalCourses,
                totalRevenue,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;

        let query = { role: { $ne: 'admin' } }; // Exclude admins

        if (role && (role === 'student' || role === 'mentor')) {
            query.role = role;
        }

        const users = await User.find(query).select('-password').sort('-createdAt');

        res.status(200).json({
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        // If user is a mentor, delete their courses and associated files
        if (user.role === 'mentor') {
            const courses = await Course.find({ mentorId: user._id });

            for (const course of courses) {
                // Delete Cloudinary files
                await deleteFile(course.thumbnailPublicId, 'image');
                await deleteFile(course.videoPublicId, 'video');

                // Delete course
                await Course.findByIdAndDelete(course._id);
            }

            // Delete enrollments for these courses
            await Enrollment.deleteMany({
                courseId: { $in: courses.map((c) => c._id) },
            });
        }

        // If user is a student, delete their enrollments
        if (user.role === 'student') {
            await Enrollment.deleteMany({ studentId: user._id });
        }

        // Delete user
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses (admin view)
// @route   GET /api/admin/courses
// @access  Private (Admin only)
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('mentorId', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            count: courses.length,
            courses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    deleteUser,
    getAllCourses,
};
