const express = require('express');
const { getPopularMentors } = require('../controllers/studentController');

const router = express.Router();

// Public routes
router.get('/popular-mentors', getPopularMentors);

module.exports = router;
