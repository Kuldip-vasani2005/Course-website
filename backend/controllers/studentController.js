const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get popular mentors
// @route   GET /api/student/popular-mentors
// @access  Public
const getPopularMentors = async (req, res) => {
    try {
        // Aggregate enrollments by mentor
        const mentorStats = await Course.aggregate([
            {
                $group: {
                    _id: '$mentorId',
                    totalEnrollments: { $sum: '$totalEnrollments' },
                    totalCourses: { $sum: 1 },
                },
            },
            { $sort: { totalEnrollments: -1 } },
            { $limit: 6 },
        ]);

        // Populate mentor details
        const mentorIds = mentorStats.map((m) => m._id);
        const mentors = await User.find({ _id: { $in: mentorIds } }).select('name email');

        const popularMentors = mentorStats.map((stat) => {
            const mentor = mentors.find((m) => m._id.toString() === stat._id.toString());
            return {
                id: stat._id,
                name: mentor ? mentor.name : '',
                email: mentor ? mentor.email : '',
                totalEnrollments: stat.totalEnrollments,
                totalCourses: stat.totalCourses,
            };
        });

        res.status(200).json({ mentors: popularMentors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPopularMentors,
};
