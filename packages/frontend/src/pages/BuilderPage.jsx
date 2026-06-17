import { useState } from 'react';
import './BuilderPage.css';

export default function BuilderPage() {
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', summary: '',
    education: [{ institution: '', degree: '', startYear: '', endYear: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
  });

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const addEducation = () => setFormData((prev) => ({ ...prev, education: [...prev.education, { institution: '', degree: '', startYear: '', endYear: '' }] }));
  const addExperience = () => setFormData((prev) => ({ ...prev, experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }] }));
  const addSkill = () => setFormData((prev) => ({ ...prev, skills: [...prev.skills, ''] }));

  const sections = ['personal', 'summary', 'education', 'experience', 'skills'];
  const sectionLabels = { personal: 'Data Pribadi', summary: 'Ringkasan', education: 'Pendidikan', experience: 'Pengalaman', skills: 'Skill' };

  return (
    <div className="builder-page page-container">
      <h1 className="page-title">Buat CV Baru</h1>
      <div className="builder-layout">
        <nav className="builder-nav">
          {sections.map((sec) => (
            <button key={sec} className={`builder-nav-btn ${activeSection === sec ? 'active' : ''}`} onClick={() => setActiveSection(sec)}>
              {sectionLabels[sec]}
            </button>
          ))}
        </nav>

        <div className="builder-form card">
          {activeSection === 'personal' && (
            <section>
              <h2 className="builder-section-title">Data Pribadi</h2>
              {['fullName', 'email', 'phone', 'address'].map((field) => (
                <div key={field} className="form-group">
                  <label className="form-label">{{ fullName: 'Nama Lengkap', email: 'Email', phone: 'Telepon', address: 'Alamat' }[field]}</label>
                  <input className="form-input" type={field === 'email' ? 'email' : 'text'} value={formData[field]} onChange={(e) => updateField(field, e.target.value)}
                    placeholder={{ fullName: 'John Doe', email: 'john@example.com', phone: '+62 812-3456-7890', address: 'Jakarta, Indonesia' }[field]} />
                </div>
              ))}
            </section>
          )}

          {activeSection === 'summary' && (
            <section>
              <h2 className="builder-section-title">Ringkasan Profesional</h2>
              <div className="form-group">
                <label className="form-label">Tulis ringkasan singkat tentang dirimu</label>
                <textarea className="form-input builder-textarea" value={formData.summary} onChange={(e) => updateField('summary', e.target.value)}
                  placeholder="Sarjana Informatika dengan 3+ tahun pengalaman..." rows={5} />
              </div>
            </section>
          )}

          {activeSection === 'education' && (
            <section>
              <h2 className="builder-section-title">Pendidikan</h2>
              {formData.education.map((edu, i) => (
                <div key={i} className="builder-repeater-item">
                  <div className="form-group">
                    <label className="form-label">Institusi</label>
                    <input className="form-input" type="text" value={edu.institution}
                      onChange={(e) => { const u = [...formData.education]; u[i].institution = e.target.value; setFormData(p => ({ ...p, education: u })); }}
                      placeholder="Universitas Indonesia" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gelar</label>
                    <input className="form-input" type="text" value={edu.degree}
                      onChange={(e) => { const u = [...formData.education]; u[i].degree = e.target.value; setFormData(p => ({ ...p, education: u })); }}
                      placeholder="S.Kom., Informatika" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tahun Mulai</label>
                      <input className="form-input" type="text" value={edu.startYear}
                        onChange={(e) => { const u = [...formData.education]; u[i].startYear = e.target.value; setFormData(p => ({ ...p, education: u })); }}
                        placeholder="2018" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tahun Selesai</label>
                      <input className="form-input" type="text" value={edu.endYear}
                        onChange={(e) => { const u = [...formData.education]; u[i].endYear = e.target.value; setFormData(p => ({ ...p, education: u })); }}
                        placeholder="2022" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-ghost" onClick={addEducation}>+ Tambah Pendidikan</button>
            </section>
          )}

          {activeSection === 'experience' && (
            <section>
              <h2 className="builder-section-title">Pengalaman Kerja</h2>
              {formData.experience.map((exp, i) => (
                <div key={i} className="builder-repeater-item">
                  <div className="form-group">
                    <label className="form-label">Perusahaan</label>
                    <input className="form-input" type="text" value={exp.company}
                      onChange={(e) => { const u = [...formData.experience]; u[i].company = e.target.value; setFormData(p => ({ ...p, experience: u })); }}
                      placeholder="PT. Teknologi Maju" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Posisi</label>
                    <input className="form-input" type="text" value={exp.position}
                      onChange={(e) => { const u = [...formData.experience]; u[i].position = e.target.value; setFormData(p => ({ ...p, experience: u })); }}
                      placeholder="Frontend Developer" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tanggal Mulai</label>
                      <input className="form-input" type="text" value={exp.startDate}
                        onChange={(e) => { const u = [...formData.experience]; u[i].startDate = e.target.value; setFormData(p => ({ ...p, experience: u })); }}
                        placeholder="Jan 2020" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tanggal Selesai</label>
                      <input className="form-input" type="text" value={exp.endDate}
                        onChange={(e) => { const u = [...formData.experience]; u[i].endDate = e.target.value; setFormData(p => ({ ...p, experience: u })); }}
                        placeholder="Sekarang" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deskripsi</label>
                    <textarea className="form-input builder-textarea" value={exp.description} rows={3}
                      onChange={(e) => { const u = [...formData.experience]; u[i].description = e.target.value; setFormData(p => ({ ...p, experience: u })); }}
                      placeholder="Jelaskan tanggung jawab dan pencapaian..." />
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-ghost" onClick={addExperience}>+ Tambah Pengalaman</button>
            </section>
          )}

          {activeSection === 'skills' && (
            <section>
              <h2 className="builder-section-title">Skill</h2>
              {formData.skills.map((skill, i) => (
                <div key={i} className="form-group">
                  <label className="form-label">Skill {i + 1}</label>
                  <input className="form-input" type="text" value={skill}
                    onChange={(e) => { const u = [...formData.skills]; u[i] = e.target.value; setFormData(p => ({ ...p, skills: u })); }}
                    placeholder="React, Node.js, Python..." />
                </div>
              ))}
              <button type="button" className="btn btn-ghost" onClick={addSkill}>+ Tambah Skill</button>
            </section>
          )}

          <div className="builder-actions">
            <button className="btn btn-primary">Simpan CV</button>
            <button className="btn btn-secondary">Preview</button>
          </div>
        </div>
      </div>
    </div>
  );
}