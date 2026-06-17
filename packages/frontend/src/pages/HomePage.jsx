import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="page-container">
          <h1 className="hero-title">
            Buat CV Profesional<br />
            <span className="hero-highlight">Dalam Hitungan Menit</span>
          </h1>
          <p className="hero-subtitle">
            Isi data, pilih template, biarkan AI membantumu menyempurnakan konten,
            lalu download PDF. Desain modern, clean, dan selalu update.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">Mulai Gratis</Link>
            <Link to="/templates" className="btn btn-secondary btn-lg">Lihat Template</Link>
          </div>
        </div>
      </section>

      <section className="features page-container">
        <h2 className="section-title">Kenapa CVLabs?</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">⚡</div>
            <h3>Cepat & Mudah</h3>
            <p>Isi data diri, pendidikan, pengalaman, dan skill — CV selesai dalam menit.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🎨</div>
            <h3>Template Modern</h3>
            <p>Pilih dari berbagai template general dan industri-specific.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🤖</div>
            <h3>Bantuan AI</h3>
            <p>Dapatkan saran penulisan dan optimasi kata kunci yang relevan dengan industrimu.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">📄</div>
            <h3>Export PDF</h3>
            <p>Download CV-mu dalam format PDF siap pakai dengan satu klik.</p>
          </div>
        </div>
      </section>

      <section className="cta-section page-container">
        <div className="cta-card">
          <h2>Siap Membuat CV Impianmu?</h2>
          <p>Gratis untuk memulai. Upgrade kapan saja untuk fitur premium.</p>
          <Link to="/signup" className="btn btn-primary">Daftar Sekarang</Link>
        </div>
      </section>
    </div>
  );
}