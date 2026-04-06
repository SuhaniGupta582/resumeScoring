const db = require('../config/db');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');

exports.applyToJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    if (!req.file) {
      return res.status(400).json({ error: 'Resume file missing' });
    }

    const filePath = req.file.path;

    // ✅ Read PDF file
    const dataBuffer = fs.readFileSync(filePath);

    // ✅ Parse PDF
    let pdfData;
    try {
      pdfData = await pdfParse(dataBuffer);
    } catch (pdfError) {
      console.error('PDF PARSE ERROR:', pdfError);
      return res.status(500).json({ error: 'Failed to parse PDF' });
    }

    const resumeText = pdfData.text;

    // ✅ Fetch job details
    db.query('SELECT * FROM jobs WHERE id = ?', [jobId], async (err, jobResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      if (!jobResult || jobResult.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const job = jobResult[0];

      const skills_required = job.requirements
        ? job.requirements.split(',').map(s => s.trim())
        : [];

      try {
        // ✅ Call Flask ML API
        const mlResponse = await axios.post('http://localhost:5001/predict', {
          resume_text: resumeText,
          job_text: job.description,
          skills: [],
          skills_required: skills_required
        });

        const score = mlResponse.data.score;

        // ✅ Save application
        db.query(
          'INSERT INTO applications (user_id, job_id, resume, score) VALUES (?, ?, ?, ?)',
          [userId, jobId, req.file.filename, score],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ error: err2.message });
            }

            return res.json({
              message: 'Applied successfully',
              score: score,
              label: mlResponse.data.shortlist_label
            });
          }
        );

      } catch (mlError) {
        console.error('ML API ERROR:', mlError.response?.data || mlError.message);
        return res.status(500).json({ error: 'ML service failed' });
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};



// ✅ NEW FUNCTION: Get applicants by job (Recruiter use)
exports.getApplicantsByJob = (req, res) => {
  const jobId = req.params.jobId;

  const query = `
    SELECT * 
    FROM applications 
    WHERE job_id = ?
  `;

  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error('DB ERROR:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.json(results);
  });
};