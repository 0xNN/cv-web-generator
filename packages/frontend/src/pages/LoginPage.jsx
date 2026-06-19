import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email harus diisi.'); return; }
    if (!password) { setError('Password harus diisi.'); return; }

    setSubmitting(true);
    try {
      await signin(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page page-container">
      <div className="auth-card card">
        <h1 className="auth-title">Masuk</h1>
        <p className="auth-subtitle">Selamat datang kembali.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" required />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-footer-text">
          Belum punya akun? <Link to="/signup">Daftar</Link>
        </p>
      </div>
    </div>
  );
}