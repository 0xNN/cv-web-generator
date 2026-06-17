import { Link } from 'react-router-dom';
import './TemplatesPage.css';

const templates = [
  { id: 'classic-professional', name: 'Classic Professional', category: 'General', description: 'Desain tradisional dengan sentuhan elegan. Cocok untuk semua industri.' },
  { id: 'modern-minimalist', name: 'Modern Minimalist', category: 'General', description: 'Desain bersih dan modern dengan layout sidebar. Fokus pada konten.' },
  { id: 'tech-industry', name: 'Tech Industry', category: 'Teknologi', description: 'Template khusus untuk industri teknologi. Tampilkan skill dan proyekmu.', pro: true },
  { id: 'finance-industry', name: 'Finance Professional', category: 'Keuangan', description: 'Desain formal dan profesional untuk industri keuangan dan perbankan.', pro: true },
  { id: 'creative-industry', name: 'Creative Portfolio', category: 'Kreatif', description: 'Tampilkan portofoliomu dengan layout yang unik dan artistik.', pro: true },
  { id: 'healthcare-industry', name: 'Healthcare', category: 'Kesehatan', description: 'Template khusus untuk tenaga medis dan profesional kesehatan.', pro: true },
  { id: 'marketing-industry', name: 'Marketing Pro', category: 'Marketing', description: 'Desain modern untuk profesional marketing dan branding.', pro: true },
];

export default function TemplatesPage() {
  return (
    <div className="templates-page page-container">
      <h1 className="page-title">Pilih Template CV</h1>
      <p className="page-subtitle">Pilih template yang sesuai dengan industrimu. Template Pro tersedia untuk pengguna berlangganan.</p>
      <div className="templates-grid">
        {templates.map((t) => (
          <div key={t.id} className={`template-card card ${t.pro ? 'template-pro' : ''}`}>
            {t.pro && <span className="template-badge">PRO</span>}
            <div className="template-preview">
              <div className="template-preview-placeholder">{t.name}</div>
            </div>
            <div className="template-info">
              <div className="template-category">{t.category}</div>
              <h3 className="template-name">{t.name}</h3>
              <p className="template-description">{t.description}</p>
            </div>
            <div className="template-actions">
              {t.pro ? <button className="btn btn-primary" disabled>Pro Only</button>
                : <Link to="/builder" className="btn btn-primary">Gunakan</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}