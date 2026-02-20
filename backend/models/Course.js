const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a course title'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please provide a course price'],
        min: 0,
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Please upload a thumbnail'],
    },
    thumbnailPublicId: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: [true, 'Please upload a course video'],
    },
    videoPublicId: {
        type: String,
        required: true,
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalEnrollments: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Virtual for mentor details
courseSchema.virtual('mentor', {
    ref: 'User',
    localField: 'mentorId',
    foreignField: '_id',
    justOne: true,
});

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
