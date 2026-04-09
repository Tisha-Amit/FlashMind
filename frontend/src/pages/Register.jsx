import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { username, email, password } = form;
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ background: 'linear-gradient(135deg, var(--mint-light), var(--lavender-light), var(--pink-light))' }}>
      <div className="auth-card fade-in-up">
        <div className="auth-logo">
          <div className="logo-icon">✨</div>
          <h1 style={{ marginBottom: 4 }}>Create Account</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Join FlashMind today</p>
        </div>

        {error && <div className="alert alert-error mb-2">⚠️ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="input-field"
              type="text"
              name="username"
              placeholder="your_username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input-field"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input-field"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? <><span className="spinner"></span> Creating account…</> : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
