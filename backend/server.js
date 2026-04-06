const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Correct CORS config (no wildcard crash)
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');

app.use('/api/recruiter', recruiterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);

// ✅ Start server
app.listen(8000, '127.0.0.1', () => {
  console.log('Server running on http://127.0.0.1:8000');
});