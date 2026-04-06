const axios = require('axios');

// ✅ Rank candidates for a job
exports.rankCandidates = async (req, res) => {
  try {
    const { job_text, skills_required, resumes } = req.body;

    if (!job_text || !skills_required || !resumes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await axios.post('http://localhost:5001/rank', {
      job_text,
      skills_required,
      resumes
    });

    return res.json(response.data);

  } catch (error) {
    console.error('RANK ERROR:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Ranking failed' });
  }
};


// ✅ Shortlist candidates above threshold
exports.shortlistCandidates = async (req, res) => {
  try {
    const { job_text, skills_required, resumes, threshold } = req.body;

    if (!job_text || !skills_required || !resumes || threshold === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await axios.post('http://localhost:5001/shortlist', {
      job_text,
      skills_required,
      resumes,
      threshold
    });

    return res.json(response.data);

  } catch (error) {
    console.error('SHORTLIST ERROR:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Shortlisting failed' });
  }
};


// ✅ Health check for ML service
exports.healthCheck = async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/health');
    return res.json(response.data);
  } catch (error) {
    console.error('HEALTH ERROR:', error.message);
    return res.status(500).json({ error: 'ML service not reachable' });
  }
};