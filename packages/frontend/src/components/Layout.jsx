import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">📄</span>
            <span className="logo-text">CVLabs</span>
          </Link>

          <nav className="nav">
            <Link to="/templates" className={`nav-link ${isActive('/templates') ? 'active' : ''}`}>
              Templates
            </Link>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/login" className="btn btn-primary nav-cta">Masuk</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p>&copy; {new Date().getFullYear()} CVLabs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}