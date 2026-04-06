const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const {
  applyToJob,
  getApplicantsByJob
} = require('../controllers/applicationController');

const authMiddleware = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resumes';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Apply to job (protected)
router.post('/apply/:jobId', authMiddleware, (req, res) => {
  upload.single('resume')(req, res, function (err) {
    if (err) {
      console.error('UPLOAD ERROR:', err);
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    applyToJob(req, res);
  });
});

// ✅ Get applicants (protected + ownership enforced in controller)
router.get('/job/:jobId', authMiddleware, getApplicantsByJob);

module.exports = router;