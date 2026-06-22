import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const templateNames = {
  'classic-professional': 'Classic Professional',
  'modern-minimalist': 'Modern Minimalist',
  'tech-it': 'Tech Industry',
  'corporate-finance': 'Finance Professional',
  'creative-design': 'Creative Portfolio',
};

export default function DashboardPage() {
  const { user, isPro, token } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/cvs', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCvs(data);
        else setCvs([]);
      })
      .catch(() => setCvs([]))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Hapus CV ini?')) return;
    try {
      const res = await fetch(`/api/cvs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCvs(prev => prev.filter(c => c.id !== id));
    } catch {}
  };

  return (
    <div className="dashboard-page page-container">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="page-title">Dashboard</h1>
          <h2>Halo, {user?.name || 'Pengguna'}! 👋</h2>
          <p>
            Kamu menggunakan akun{' '}
            <span className={`subscription-badge ${isPro ? 'pro' : 'free'}`}>
              {isPro ? 'PRO' : 'Free'}
            </span>
            {cvs.length > 0 && ` · ${cvs.length} CV tersimpan`}
          </p>
        </div>
        <Link to="/builder" className="btn btn-primary">+ Buat CV Baru</Link>
      </div>

      {loading ? (
        <div className="dashboard-loading">Memuat CV...</div>
      ) : cvs.length === 0 ? (
        <div className="dashboard-empty card">
          <div className="empty-icon">📄</div>
          <h3>Belum Ada CV</h3>
          <p>Mulai dengan membuat CV pertamamu.</p>
          <Link to="/builder" className="btn btn-primary">Buat CV Sekarang</Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {cvs.map(cv => (
            <div key={cv.id} className="cv-card card">
              <h3>{cv.title || 'CV'}</h3>
              <p className="cv-card-template">
                {templateNames[cv.template_id] || cv.template_id}
              </p>
              <p className="cv-card-date">
                {cv.updated_at ? new Date(cv.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </p>
              <div className="cv-card-actions">
                <Link to={`/builder?id=${cv.id}`} className="btn btn-secondary btn-sm">Edit</Link>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(cv.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}