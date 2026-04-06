const db = require('../config/db');


// ✅ CREATE JOB (already correct)
exports.createJob = (req, res) => {
  const { title, description, requirements } = req.body;
  const recruiterId = req.user.id;

  db.query(
    'INSERT INTO jobs (title, description, requirements, recruiter_id) VALUES (?, ?, ?, ?)',
    [title, description, requirements, recruiterId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: 'Job created successfully' });
    }
  );
};


// ✅ GET JOBS (FIXED: role-based access)
exports.getAllJobs = (req, res) => {
  const user = req.user;

  let query;
  let params = [];

  if (user.role === 'recruiter') {
    // ✅ Recruiter sees ONLY their jobs
    query = 'SELECT * FROM jobs WHERE recruiter_id = ?';
    params = [user.id];
  } else {
    // ✅ Applicant sees all jobs
    query = 'SELECT * FROM jobs';
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};