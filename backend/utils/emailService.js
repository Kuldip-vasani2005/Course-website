const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP email
const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Account - Course Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; border: 2px dashed #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Course Platform!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for registering with Course Platform. Please use the OTP below to verify your account:</p>
            <div class="otp-box">${otp}</div>
            <p><strong>This OTP will expire in 10 minutes.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Course Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send welcome email
const sendWelcomeEmail = async (email, name, role) => {
  const roleMessages = {
    student: 'You can now browse and purchase courses from top mentors.',
    mentor: 'You can now create and manage your courses, and start earning!',
    admin: 'You have full access to manage the platform.',
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Course Platform!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Verified!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your account has been successfully verified! Welcome to Course Platform.</p>
            <p><strong>Your role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
            <p>${roleMessages[role]}</p>
            <a href="${process.env.FRONTEND_URL}/login" class="button">Login Now</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send purchase confirmation email
const sendPurchaseEmail = async (email, name, courseTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Course Purchase Successful!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .course-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Successful!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for your purchase! You now have access to:</p>
            <div class="course-box">
              <h3>${courseTitle}</h3>
            </div>
            <p>You can start learning right away by accessing the course in your dashboard.</p>
            <a href="${process.env.FRONTEND_URL}/my-courses" class="button">View My Courses</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};


const sendResetPasswordOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // ✅ ADD THIS
    to: email,
    subject: 'Password Reset OTP - Course Platform',
    html: `
      <h3>Hello ${name},</h3>
      <p>You requested a password reset.</p>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p><strong>This OTP will expire in 10 minutes.</strong></p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};



module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPurchaseEmail,
  sendResetPasswordOTPEmail,
};
