import { useState } from 'react';
import { API } from '../api';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant'
  });

  const handleSubmit = async () => {
    await API.post('/auth/signup', form);
    alert('Signup successful');
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Signup</h2>

      <input
        placeholder="Name"
        onChange={e => setForm({...form, name:e.target.value})}
      />

      <input
        placeholder="Email"
        onChange={e => setForm({...form, email:e.target.value})}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({...form, password:e.target.value})}
      />

      <select onChange={e => setForm({...form, role:e.target.value})}>
        <option value="applicant">Applicant</option>
        <option value="recruiter">Recruiter</option>
      </select>

      <button onClick={handleSubmit}>Signup</button>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}