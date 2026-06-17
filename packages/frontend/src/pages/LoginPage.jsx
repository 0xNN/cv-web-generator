import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email dan password harus diisi.'); return; }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Login gagal.'); }
      window.location.href = '/dashboard';
    } catch (err) { setError(err.message); }
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
            <input id="email" className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">Masuk</button>
        </form>
        <p className="auth-footer-text">Belum punya akun? <Link to="/signup">Daftar</Link></p>
      </div>
    </div>
  );
}