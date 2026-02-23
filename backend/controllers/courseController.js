const Course = require('../models/Course');
const User = require('../models/User');
const { uploadImage, uploadVideo, deleteFile } = require('../utils/cloudinaryUpload');
const fs = require('fs');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Mentor only)
const createCourse = async (req, res) => {
    try {
        const { title, price, category, description } = req.body;

        // Validate input
        if (!title || !price || !category || !description) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!req.files || !req.files.thumbnail || !req.files.video) {
            return res.status(400).json({ message: 'Please upload both thumbnail and video' });
        }

        // Upload files to Cloudinary
        const thumbnailResult = await uploadImage(req.files.thumbnail[0]);
        const videoResult = await uploadVideo(req.files.video[0]);

        // Delete local files
        fs.unlinkSync(req.files.thumbnail[0].path);
        fs.unlinkSync(req.files.video[0].path);

        // Create course
        const course = await Course.create({
            title,
            price,
            category,
            description,
            thumbnailUrl: thumbnailResult.url,
            thumbnailPublicId: thumbnailResult.publicId,
            videoUrl: videoResult.url,
            videoPublicId: videoResult.publicId,
            mentorId: req.user._id,
        });

        res.status(201).json({
            message: 'Course created successfully',
            course,
        });
    } catch (error) {
        // Clean up uploaded files if course creation fails
        if (req.files) {
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                fs.unlinkSync(req.files.thumbnail[0].path);
            }
            if (req.files.video && req.files.video[0]) {
                fs.unlinkSync(req.files.video[0].path);
            }
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses (with filters)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const { category, search, sort } = req.query;

        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        let coursesQuery = Course.find(query).populate('mentorId', 'name email');

        // Sorting
        if (sort === 'popular') {
            coursesQuery = coursesQuery.sort('-totalEnrollments');
        } else if (sort === 'rating') {
            coursesQuery = coursesQuery.sort('-averageRating');
        } else if (sort === 'price_low') {
            coursesQuery = coursesQuery.sort('price');
        } else if (sort === 'price_high') {
            coursesQuery = coursesQuery.sort('-price');
        } else {
            coursesQuery = coursesQuery.sort('-createdAt');
        }

        const courses = await coursesQuery;

        res.status(200).json({
            count: courses.length,
            courses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('mentorId', 'name email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Mentor - own courses only)
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the creator
        if (course.mentorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const { title, price, category, description } = req.body;

        // Update text fields
        if (title) course.title = title;
        if (price) course.price = price;
        if (category) course.category = category;
        if (description) course.description = description;

        // Update thumbnail if provided
        if (req.files && req.files.thumbnail) {
            await deleteFile(course.thumbnailPublicId, 'image');
            const thumbnailResult = await uploadImage(req.files.thumbnail[0]);
            course.thumbnailUrl = thumbnailResult.url;
            course.thumbnailPublicId = thumbnailResult.publicId;
            fs.unlinkSync(req.files.thumbnail[0].path);
        }

        // Update video if provided
        if (req.files && req.files.video) {
            await deleteFile(course.videoPublicId, 'video');
            const videoResult = await uploadVideo(req.files.video[0]);
            course.videoUrl = videoResult.url;
            course.videoPublicId = videoResult.publicId;
            fs.unlinkSync(req.files.video[0].path);
        }

        await course.save();

        res.status(200).json({
            message: 'Course updated successfully',
            course,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Mentor - own courses, Admin - all courses)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check authorization (mentor can delete own, admin can delete all)
        if (
            req.user.role !== 'admin' &&
            course.mentorId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        // Delete files from Cloudinary
        await deleteFile(course.thumbnailPublicId, 'image');
        await deleteFile(course.videoPublicId, 'video');

        // Delete course
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get popular courses
// @route   GET /api/courses/popular/list
// @access  Public
const getPopularCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .sort('-totalEnrollments')
            .limit(6)
            .populate('mentorId', 'name email');

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getPopularCourses,
};
