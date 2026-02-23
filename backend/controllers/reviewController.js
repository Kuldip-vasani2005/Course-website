const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Student only - must be enrolled)
const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;

        if (!courseId || !rating || !comment) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if student is enrolled in the course
        const enrollment = await Enrollment.findOne({
            studentId: req.user._id,
            courseId,
        });

        if (!enrollment) {
            return res.status(403).json({
                message: 'You must purchase this course before leaving a review',
            });
        }

        // Check if student already reviewed
        const existingReview = await Review.findOne({
            studentId: req.user._id,
            courseId,
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this course' });
        }

        // Create review
        const review = await Review.create({
            studentId: req.user._id,
            courseId,
            rating,
            comment,
        });

        await review.populate('studentId', 'name');

        res.status(201).json({
            message: 'Review submitted successfully',
            review,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a course
// @route   GET /api/reviews/:courseId
// @access  Public
const getCourseReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ courseId: req.params.courseId })
            .populate('studentId', 'name')
            .sort('-createdAt');

        res.status(200).json({
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Student - own reviews only)
const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user is the review creator
        if (review.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        const { rating, comment } = req.body;

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        res.status(200).json({
            message: 'Review updated successfully',
            review,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Student - own reviews, Admin - all reviews)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check authorization
        if (
            req.user.role !== 'admin' &&
            review.studentId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getCourseReviews,
    updateReview,
    deleteReview,
};
