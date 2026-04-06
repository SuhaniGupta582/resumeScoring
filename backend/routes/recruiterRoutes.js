const express = require('express');
const router = express.Router();

const {
  rankCandidates,
  shortlistCandidates,
  healthCheck
} = require('../controllers/recruiterController');

// Rank resumes
router.post('/rank', rankCandidates);

// Shortlist resumes
router.post('/shortlist', shortlistCandidates);

// Health check
router.get('/health', healthCheck);

module.exports = router;