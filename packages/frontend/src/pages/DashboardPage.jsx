import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  const savedCVs = [];

  return (
    <div className="dashboard-page page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Kelola CV-mu di sini.</p>
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