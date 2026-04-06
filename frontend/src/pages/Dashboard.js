import { useState, useEffect } from 'react';
import { API } from '../api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [jobs, setJobs] = useState([]);
  const [files, setFiles] = useState({});
  const [results, setResults] = useState({});

  // recruiter states
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [ranked, setRanked] = useState(null);

  useEffect(() => {
    if (!user) window.location.href = '/';
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await API.get('/jobs');
    setJobs(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleFileChange = (jobId, file) => {
    setFiles(prev => ({ ...prev, [jobId]: file }));
  };

  // ✅ Applicant apply
  const handleApply = async (jobId) => {
    const file = files[jobId];

    if (!file) {
      alert('Select resume first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await API.post(`/applications/apply/${jobId}`, formData, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      setResults(prev => ({
        ...prev,
        [jobId]: res.data
      }));

      alert(`Applied! Score: ${res.data.score}`);

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Fetch applicants (recruiter)
  const fetchApplicants = async (jobId) => {
    setSelectedJob(jobId);

    try {
      const res = await API.get(`/applications/job/${jobId}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      setApplicants(res.data);
      setRanked(null);

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Rank candidates using Flask
  const handleRank = async () => {
    if (!selectedJob) return;

    try {
      const job = jobs.find(j => j.id === selectedJob);

      const resumes = applicants.map(a => ({
        id: a.id,
        resume_text: a.resume_text || '',
        skills: []
      }));

      const res = await API.post('/recruiter/rank', {
        job_text: job.description,
        skills_required: job.requirements ? job.requirements.split(',') : [],
        resumes
      });

      setRanked(res.data.ranked_resumes);

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Welcome {user.name}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* ================= APPLICANT ================= */}
      {user.role === 'applicant' && (
        <div>
          <h3 className="section-title">Jobs</h3>

          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <h4>{job.title}</h4>
              <p>{job.description}</p>

              <input
                type="file"
                onChange={(e) => handleFileChange(job.id, e.target.files[0])}
              />

              <button
                className="apply-btn"
                onClick={() => handleApply(job.id)}
              >
                Apply
              </button>

              {results[job.id] && (
                <div className="result-box">
                  Score: {results[job.id].score} <br />
                  Label: {results[job.id].label}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= RECRUITER ================= */}
      {user.role === 'recruiter' && (
        <div>
          <h3 className="section-title">Recruiter Dashboard</h3>

          <h4>Select Job</h4>

          {jobs.map(job => (
            <button
              key={job.id}
              className="apply-btn"
              onClick={() => fetchApplicants(job.id)}
              style={{ marginRight: '10px', marginBottom: '10px' }}
            >
              {job.title}
            </button>
          ))}

          {selectedJob && (
            <>
              <h4 className="section-title">Applicants</h4>

              <button className="rank-btn" onClick={handleRank}>
                Rank Candidates
              </button>

              {applicants.map(app => (
                <div key={app.id} className="applicant-card">
                  Applicant ID: {app.user_id} | Score: {app.score}
                </div>
              ))}

              {ranked && (
                <>
                  <h4 className="section-title">Ranked Candidates</h4>

                  {ranked.map(r => (
                    <div key={r.id} className="ranked-card">
                      Rank: {r.rank} | ID: {r.id} | Score: {r.score} | {r.shortlist_label}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}