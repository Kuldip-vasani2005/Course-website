const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendOTPEmail, sendWelcomeEmail, sendResetPasswordOTPEmail } = require('../utils/emailService');

// @desc    Register user and send OTP
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user with unverified status (don't hash password yet)
        const user = new User({
            name,
            email,
            password, // Will be hashed only after OTP verification
            role: role || 'student',
            isVerified: false,
        });

        // Generate OTP
        const otp = user.generateOTP();

        // Save user (password will be hashed by pre-save hook)
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, name, otp);

        res.status(201).json({
            message: 'OTP sent to your email. Please verify to complete registration.',
            email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and OTP' });
        }

        // Find user with OTP fields
        const user = await User.findOne({ email }).select('+otp +otpExpiry');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account already verified. Please login.' });
        }

        // Check OTP validity
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired. Please register again.' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name, user.role);

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Account verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if account is verified
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your account first' });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                },
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request password reset
// @route   POST /api/auth/request-password-reset
// @access  Public
const requestPasswordReset = async (req, res) => {
    try {
        console.log("Request reset called"); // Add this

        const { email } = req.body;

        const user = await User.findOne({ email });

        console.log("User found:", user);

        const otp = user.generateResetPasswordOTP();
        console.log("OTP generated:", otp);

        await user.save();

        await sendResetPasswordOTPEmail(user.email, user.name, otp);

        res.status(200).json({
            message: 'Password reset OTP sent',
        });

    } catch (error) {
        console.error("RESET ERROR:", error); // VERY IMPORTANT
        res.status(500).json({ message: error.message });
    }
};


// @desc    Verify reset password OTP
// @route   POST /api/auth/verify-password-reset-otp
// @access  Public
const verifyPasswordResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email })
            .select('+resetPasswordOTP +resetPasswordOTPExpiry');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.resetPasswordOTPExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.status(200).json({
            message: 'OTP verified successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email })
            .select('+resetPasswordOTP +resetPasswordOTPExpiry +password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.resetPasswordOTPExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiry = undefined;

        await user.save(); // password will hash via pre-save hook

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Password reset successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const  updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    await user.save();

    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
};



module.exports = {
    register,
    verifyOTP,
    login,
    getMe,
    updateDetails,
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPassword,
    updateProfile,

};
