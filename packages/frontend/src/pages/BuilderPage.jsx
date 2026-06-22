import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CVPrompt, { templates, templateIds } from '../components/CVPrompt';
import './BuilderPage.css';

const defaultForm = {
  fullName: '', email: '', phone: '', address: '', summary: '',
  education: [{ institution: '', degree: '', startYear: '', endYear: '' }],
  experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  skills: [''],
};

const sections = ['personal', 'summary', 'education', 'experience', 'skills'];
const sectionLabels = {
  personal: 'Data Pribadi', summary: 'Ringkasan',
  education: 'Pendidikan', experience: 'Pengalaman', skills: 'Skill',
};

const fieldLabels = {
  fullName: 'Nama Lengkap', email: 'Email', phone: 'Telepon', address: 'Alamat',
};
const fieldPlaceholders = {
  fullName: 'John Doe', email: 'john@example.com',
  phone: '+62 812-3456-7890', address: 'Jakarta, Indonesia',
};

export default function BuilderPage() {
  const [formData, setFormData] = useState(defaultForm);
  const [templateId, setTemplateId] = useState('classic-professional');
  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [cvId, setCvId] = useState(null);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef(null);
  const { token, isPro } = useAuth();
  const navigate = useNavigate();

  const updateField = (f, v) => setFormData(p => ({ ...p, [f]: v }));
  const addEducation = () => setFormData(p => ({ ...p, education: [...p.education, { institution: '', degree: '', startYear: '', endYear: '' }] }));
  const addExperience = () => setFormData(p => ({ ...p, experience: [...p.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }] }));
  const addSkill = () => setFormData(p => ({ ...p, skills: [...p.skills, ''] }));

  const updateArray = (key, idx, field, val) => {
    setFormData(p => {
      const arr = [...p[key]];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...p, [key]: arr };
    });
  };

  // Save CV to backend
  const handleSave = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    setSaving(true); setSaveMsg('');
    try {
      const title = formData.fullName?.trim() ? `CV - ${formData.fullName}` : 'CV Baru';
      const body = { title, template_id: templateId, data: formData };
      const url = cvId ? `/api/cvs/${cvId}` : '/api/cvs';
      const method = cvId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal menyimpan');
      if (json.cv?.id) setCvId(json.cv.id);
      setSaveMsg('CV tersimpan!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.message);
    } finally { setSaving(false); }
  }, [formData, templateId, token, cvId, navigate]);

  // PDF export via html2canvas
  const handleExportPdf = useCallback(async () => {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    setSavingPdf(true);
    try {
      const el = previewRef.current;
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      const name = formData.fullName?.trim() || 'CV';
      pdf.save(`${name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      setSaveMsg('Gagal export PDF');
    } finally { setSavingPdf(false); }
  }, [formData]);

  // Load existing CV (from URL param or dashboard)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && token) {
      setLoading(true);
      fetch(`/api/cvs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()).then(cv => {
        if (cv && cv.data) {
          setFormData(cv.data);
          setTemplateId(cv.template_id);
          setCvId(cv.id);
        }
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div className="builder-page page-container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'var(--space-md)',marginBottom:'var(--space-lg)'}}>
        <h1 className="page-title" style={{marginBottom:0}}>{cvId ? 'Edit CV' : 'Buat CV Baru'}</h1>
        <div style={{display:'flex',gap:'var(--space-sm)'}}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : cvId ? 'Simpan Perubahan' : 'Simpan CV'}
          </button>
          <button className="btn btn-secondary" onClick={handleExportPdf} disabled={savingPdf}>
            {savingPdf ? 'Membuat PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {saveMsg && <div className={`save-status ${saveMsg.includes('Gagal') || saveMsg.includes('gagal') ? 'error' : ''}`}>{saveMsg}</div>}

      {/* Template selection */}
      <div className="template-selector">
        {templateIds.map(id => {
          const t = templates[id];
          const isDisabled = t.pro && !isPro;
          return (
            <button key={id} className={`template-option ${templateId === id ? 'active' : ''} ${isDisabled ? 'pro-required' : ''}`}
              onClick={() => { if (!isDisabled) setTemplateId(id); }}
              title={isDisabled ? 'Template Pro — berlangganan untuk akses' : ''}>
              {t.name} <span className={t.pro ? 'template-badge-pro' : 'template-badge-free'}>{t.pro ? 'PRO' : 'FREE'}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="card" style={{textAlign:'center',padding:'3rem'}}><p>Memuat CV...</p></div>
      ) : (
        <div className="builder-two-col">
          {/* FORM COLUMN */}
          <div className="builder-form-col">
            <div className="builder-tabs">
              {sections.map(sec => (
                <button key={sec} className={`builder-tab ${activeSection === sec ? 'active' : ''}`}
                  onClick={() => setActiveSection(sec)}>{sectionLabels[sec]}</button>
              ))}
            </div>

            <div className="card">
              {activeSection === 'personal' && (
                <section>
                  <h2 className="builder-section-title">Data Pribadi</h2>
                  {['fullName', 'email', 'phone', 'address'].map(f => (
                    <div key={f} className="form-group">
                      <label className="form-label">{fieldLabels[f]}</label>
                      <input className="form-input" type={f === 'email' ? 'email' : 'text'}
                        value={formData[f]} onChange={e => updateField(f, e.target.value)}
                        placeholder={fieldPlaceholders[f]} />
                    </div>
                  ))}
                </section>
              )}

              {activeSection === 'summary' && (
                <section>
                  <h2 className="builder-section-title">Ringkasan Profesional</h2>
                  <textarea className="form-input builder-textarea" value={formData.summary}
                    onChange={e => updateField('summary', e.target.value)}
                    placeholder="Sarjana Informatika dengan 3+ tahun pengalaman..." rows={5} />
                </section>
              )}

              {activeSection === 'education' && (
                <section>
                  <h2 className="builder-section-title">Pendidikan</h2>
                  {formData.education.map((e, i) => (
                    <div key={i} className="builder-repeater-item">
                      <div className="form-group">
                        <label className="form-label">Institusi</label>
                        <input className="form-input" value={e.institution}
                          onChange={ev => updateArray('education', i, 'institution', ev.target.value)}
                          placeholder="Universitas Indonesia" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gelar</label>
                        <input className="form-input" value={e.degree}
                          onChange={ev => updateArray('education', i, 'degree', ev.target.value)}
                          placeholder="S.Kom., Informatika" />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Tahun Mulai</label>
                          <input className="form-input" value={e.startYear}
                            onChange={ev => updateArray('education', i, 'startYear', ev.target.value)}
                            placeholder="2018" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tahun Selesai</label>
                          <input className="form-input" value={e.endYear}
                            onChange={ev => updateArray('education', i, 'endYear', ev.target.value)}
                            placeholder="2022" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-ghost" onClick={addEducation}>+ Tambah Pendidikan</button>
                </section>
              )}

              {activeSection === 'experience' && (
                <section>
                  <h2 className="builder-section-title">Pengalaman Kerja</h2>
                  {formData.experience.map((e, i) => (
                    <div key={i} className="builder-repeater-item">
                      <div className="form-group">
                        <label className="form-label">Perusahaan</label>
                        <input className="form-input" value={e.company}
                          onChange={ev => updateArray('experience', i, 'company', ev.target.value)}
                          placeholder="PT. Teknologi Maju" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Posisi</label>
                        <input className="form-input" value={e.position}
                          onChange={ev => updateArray('experience', i, 'position', ev.target.value)}
                          placeholder="Frontend Developer" />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Tanggal Mulai</label>
                          <input className="form-input" value={e.startDate}
                            onChange={ev => updateArray('experience', i, 'startDate', ev.target.value)}
                            placeholder="Jan 2020" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tanggal Selesai</label>
                          <input className="form-input" value={e.endDate}
                            onChange={ev => updateArray('experience', i, 'endDate', ev.target.value)}
                            placeholder="Sekarang" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Deskripsi</label>
                        <textarea className="form-input builder-textarea" value={e.description} rows={3}
                          onChange={ev => updateArray('experience', i, 'description', ev.target.value)}
                          placeholder="Jelaskan tanggung jawab dan pencapaian..." />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-ghost" onClick={addExperience}>+ Tambah Pengalaman</button>
                </section>
              )}

              {activeSection === 'skills' && (
                <section>
                  <h2 className="builder-section-title">Skill</h2>
                  {formData.skills.map((s, i) => (
                    <div key={i} className="form-group">
                      <label className="form-label">Skill {i + 1}</label>
                      <input className="form-input" value={s}
                        onChange={ev => {
                          const arr = [...formData.skills];
                          arr[i] = ev.target.value;
                          setFormData(p => ({ ...p, skills: arr }));
                        }} placeholder="React, Node.js, Python..." />
                    </div>
                  ))}
                  <button className="btn btn-ghost" onClick={addSkill}>+ Tambah Skill</button>
                </section>
              )}
            </div>
          </div>

          {/* PREVIEW COLUMN */}
          <div className="builder-preview-col">
            <div className="preview-header">
              <h3>Preview — {templates[templateId]?.name}</h3>
              <div className="preview-actions">
                <button className="btn btn-secondary btn-sm" onClick={handleExportPdf} disabled={savingPdf}>
                  {savingPdf ? '...' : 'PDF'}
                </button>
              </div>
            </div>
            <div className="cv-preview-frame" ref={previewRef} style={{ transform: 'scale(0.7)', width: `${100/0.7}%` }}>
              <CVPrompt data={formData} templateId={templateId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}