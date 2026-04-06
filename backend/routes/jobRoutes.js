const express = require('express');
const router = express.Router();

const { createJob, getAllJobs } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Recruiter creates job (protected)
router.post('/create', authMiddleware, createJob);

// ✅ Everyone can view jobs (but filtered based on role)
router.get('/', authMiddleware, getAllJobs);

module.exports = router;