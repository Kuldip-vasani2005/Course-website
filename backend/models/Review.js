const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure one review per student per course
reviewSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Update course average rating after review is saved
reviewSchema.post('save', async function () {
    const Course = mongoose.model('Course');
    const Review = mongoose.model('Review');

    const stats = await Review.aggregate([
        { $match: { courseId: this.courseId } },
        {
            $group: {
                _id: '$courseId',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Course.findByIdAndUpdate(this.courseId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            totalReviews: stats[0].totalReviews,
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema);
