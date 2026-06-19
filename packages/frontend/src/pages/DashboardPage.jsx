import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, isPro } = useAuth();
  const savedCVs = [];

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
          </p>
        </div>
        <Link to="/builder" className="btn btn-primary">+ Buat CV Baru</Link>
      </div>

      {savedCVs.length === 0 ? (
        <div className="dashboard-empty card">
          <div className="empty-icon">📄</div>
          <h3>Belum Ada CV</h3>
          <p>Mulai dengan membuat CV pertamamu.</p>
          <Link to="/builder" className="btn btn-primary">Buat CV Sekarang</Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {savedCVs.map((cv) => (
            <div key={cv.id} className="cv-card card">
              <h3>{cv.title}</h3>
              <p className="cv-card-template">{cv.template}</p>
              <div className="cv-card-actions">
                <button className="btn btn-secondary btn-sm">Edit</button>
                <button className="btn btn-ghost btn-sm">Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}