import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Nama harus diisi.'); return; }
    if (!email.trim()) { setError('Email harus diisi.'); return; }
    if (!password || password.length < 6) { setError('Password minimal 6 karakter.'); return; }

    setSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page page-container">
      <div className="auth-card card">
        <h1 className="auth-title">Daftar Akun</h1>
        <p className="auth-subtitle">Buat akun untuk mulai membuat CV.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nama Lengkap</label>
            <input id="name" className="form-input" type="text" value={name}
              onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-footer-text">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </div>
    </div>
  );
}