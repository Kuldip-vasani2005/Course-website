const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const stripe = require('../config/stripe');
const { sendPurchaseEmail } = require('../utils/emailService');

// @desc    Create Stripe Checkout Session (with redirect)
// @route   POST /api/enrollments/checkout
// @access  Private (Student only)
const createCheckoutSession = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: 'Please provide courseId' });
        }

        // Check if course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if student already enrolled
        const existingEnrollment = await Enrollment.findOne({
            studentId: req.user._id,
            courseId,
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.title,
                            description: course.description,
                        },
                        unit_amount: Math.round(course.price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/courses/${courseId}`,
            metadata: {
                studentId: req.user._id.toString(),
                courseId: courseId,
                studentName: req.user.name,
                studentEmail: req.user.email,
                courseTitle: course.title,
            },
        });

        res.status(200).json({
            sessionId: session.id,
            url: session.url,
        });
    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Stripe payment intent
// @route   POST /api/enrollments/create-payment-intent
// @access  Private (Student only)
const createPaymentIntent = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: 'Please provide courseId' });
        }

        // Check if course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if student already enrolled
        const existingEnrollment = await Enrollment.findOne({
            studentId: req.user._id,
            courseId,
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }

        // Create Stripe payment intent with auto-confirm for testing
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(course.price * 100), // Convert to cents
            currency: 'usd',
            confirm: true, // Auto-confirm for testing
            payment_method: 'pm_card_visa', // Test payment method
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never' // Prevent redirect-based payment methods
            },
            metadata: {
                studentId: req.user._id.toString(),
                courseId: courseId,
                studentName: req.user.name,
                studentEmail: req.user.email,
                courseTitle: course.title,
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Stripe session and create enrollment
// @route   POST /api/enrollments/verify-session
// @access  Private (Student only)
const verifySession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Verify payment was successful
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Payment not completed' });
        }

        const { studentId, courseId, studentName, studentEmail, courseTitle } = session.metadata;

        // Check if enrollment already exists
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
            return res.status(200).json({
                message: 'Already enrolled',
                enrollment: existingEnrollment
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            studentId,
            courseId,
            paymentIntentId: session.payment_intent,
        });

        // Increment course enrollments
        await Course.findByIdAndUpdate(courseId, {
            $inc: { totalEnrollments: 1 },
        });

        // Send email
        try {
            await sendPurchaseEmail(studentEmail, studentName, courseTitle);
        } catch (emailError) {
            console.error('Email send failed:', emailError);
        }

        res.status(200).json({
            message: 'Enrollment successful',
            enrollment,
        });
    } catch (error) {
        console.error('Session verification error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Confirm payment and create enrollment
// @route   POST /api/enrollments/confirm-payment
// @access  Private (Student only)
const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ message: 'Please provide payment intent ID' });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                message: 'Payment not completed',
                status: paymentIntent.status
            });
        }

        const { studentId, courseId, studentName, studentEmail, courseTitle } = paymentIntent.metadata;

        // Check if enrollment already exists (prevent duplicates)
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
            return res.status(200).json({
                message: 'Already enrolled',
                enrollment: existingEnrollment
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            studentId,
            courseId,
            paymentIntentId: paymentIntent.id,
        });

        // Increment course enrollments
        await Course.findByIdAndUpdate(courseId, {
            $inc: { totalEnrollments: 1 },
        });

        // Send purchase confirmation email
        try {
            await sendPurchaseEmail(studentEmail, studentName, courseTitle);
        } catch (emailError) {
            console.error('Email send failed:', emailError);
            // Don't fail the enrollment if email fails
        }

        res.status(200).json({
            message: 'Enrollment successful',
            enrollment,
        });
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get my enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private (Student only)
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ studentId: req.user._id })
            .populate({
                path: 'courseId',
                populate: {
                    path: 'mentorId',
                    select: 'name email',
                },
            })
            .sort('-purchaseDate');

        // 🔥 Remove enrollments where course was deleted
        const validEnrollments = enrollments.filter(
            (enrollment) => enrollment.courseId !== null
        );

        res.status(200).json({
            count: validEnrollments.length,
            enrollments: validEnrollments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Check if student is enrolled in a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private (Student only)
const checkEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            studentId: req.user._id,
            courseId: req.params.courseId,
        });

        res.status(200).json({
            isEnrolled: !!enrollment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCheckoutSession,
    verifySession,
    createPaymentIntent,
    confirmPayment,
    getMyEnrollments,
    checkEnrollment,
};
