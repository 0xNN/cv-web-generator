import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Semua field harus diisi.'); return; }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Registrasi gagal.'); }
      window.location.href = '/dashboard';
    } catch (err) { setError(err.message); }
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
            <input id="name" className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter" />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">Daftar</button>
        </form>
        <p className="auth-footer-text">Sudah punya akun? <Link to="/login">Masuk</Link></p>
      </div>
    </div>
  );
}