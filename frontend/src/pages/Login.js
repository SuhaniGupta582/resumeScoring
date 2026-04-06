import { useState } from 'react';
import { API } from '../api';
import { Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });

  const handleLogin = async () => {
    const res = await API.post('/auth/login', form);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    window.location.href = '/dashboard';
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={e => setForm({...form, email:e.target.value})}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({...form, password:e.target.value})}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        New user? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}