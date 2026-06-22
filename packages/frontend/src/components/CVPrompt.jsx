/**
 * CVPrompt — Renders a live preview of the CV using form data + selected template CSS.
 * 
 * Templates: classic-professional, modern-minimalist, tech-it, corporate-finance, creative-design
 * Each template uses specific class names documented in packages/design/README.md
 */
const templates = {
  'classic-professional': {
    name: 'Classic Professional',
    category: 'General',
    free: true,
  },
  'modern-minimalist': {
    name: 'Modern Minimalist',
    category: 'General',
    free: true,
  },
  'tech-it': {
    name: 'Tech Industry',
    category: 'Teknologi',
    pro: true,
  },
  'corporate-finance': {
    name: 'Finance Professional',
    category: 'Keuangan',
    pro: true,
  },
  'creative-design': {
    name: 'Creative Portfolio',
    category: 'Kreatif',
    pro: true,
  },
};

const templateIds = Object.keys(templates);

export default function CVPrompt({ data, templateId }) {
  if (!data) return null;
  const { fullName, email, phone, address, summary, education, experience, skills } = data;
  const tpl = templateId || 'classic-professional';

  // Common contact info
  const contactItems = [email, phone, address].filter(Boolean);

  return (
    <div className={`cv-container ${tpl}`}>
      {/* === CLASSIC PROFESSIONAL === */}
      {tpl === 'classic-professional' && (
        <>
          <header className="header">
            <h1>{fullName || 'Nama Lengkap'}</h1>
            <div className="contact-info">
              {contactItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          </header>
          {summary && (
            <section>
              <h2>Professional Summary</h2>
              <p>{summary}</p>
            </section>
          )}
          {education?.length > 0 && education[0]?.institution && (
            <section>
              <h2>Education</h2>
              {education.filter(e => e.institution).map((edu, i) => (
                <div key={i} className="experience-item">
                  <div className="item-header">
                    <span className="item-title">{edu.degree || 'Gelar'}</span>
                    {edu.startYear || edu.endYear ? <span className="item-date">{edu.startYear} - {edu.endYear}</span> : null}
                  </div>
                  <div className="item-subtitle">{edu.institution}</div>
                </div>
              ))}
            </section>
          )}
          {experience?.length > 0 && experience[0]?.company && (
            <section>
              <h2>Experience</h2>
              {experience.filter(e => e.company).map((exp, i) => (
                <div key={i} className="experience-item">
                  <div className="item-header">
                    <span className="item-title">{exp.position || 'Posisi'}</span>
                    {exp.startDate || exp.endDate ? <span className="item-date">{exp.startDate} - {exp.endDate}</span> : null}
                  </div>
                  <div className="item-subtitle">{exp.company}</div>
                  {exp.description && <p style={{marginTop: '0.25rem', fontSize: '0.875rem'}}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}
          {skills?.length > 0 && skills[0] && (
            <section>
              <h2>Skills</h2>
              <ul>{skills.filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}</ul>
            </section>
          )}
        </>
      )}

      {/* === MODERN MINIMALIST === */}
      {tpl === 'modern-minimalist' && (
        <>
          <aside className="sidebar">
            <h1>{fullName || 'Nama Lengkap'}</h1>
            {summary && <div className="job-title" style={{marginBottom: '1rem'}}>{summary.substring(0, 80)}</div>}
            <div className="sidebar-section">
              <h3 className="sidebar-h3">Contact</h3>
              <ul className="contact-list">
                {contactItems.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            {skills?.length > 0 && skills[0] && (
              <div className="sidebar-section">
                <h3 className="sidebar-h3">Skills</h3>
                <ul className="skills-list">
                  {skills.filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </aside>
          <main className="main-content">
            {summary && (
              <section className="section">
                <h2>Summary</h2>
                <div className="item-description">{summary}</div>
              </section>
            )}
            {education?.length > 0 && education[0]?.institution && (
              <section className="section">
                <h2>Education</h2>
                {education.filter(e => e.institution).map((edu, i) => (
                  <div key={i} className="experience-item">
                    <div className="item-header">
                      <div className="item-title">{edu.degree || 'Gelar'}</div>
                      <div className="item-subtitle">{edu.institution}</div>
                      {edu.startYear || edu.endYear ? <div className="item-date">{edu.startYear} - {edu.endYear}</div> : null}
                    </div>
                  </div>
                ))}
              </section>
            )}
            {experience?.length > 0 && experience[0]?.company && (
              <section className="section">
                <h2>Experience</h2>
                {experience.filter(e => e.company).map((exp, i) => (
                  <div key={i} className="experience-item">
                    <div className="item-header">
                      <div className="item-title">{exp.position || 'Posisi'}</div>
                      <div className="item-subtitle">{exp.company}</div>
                      {exp.startDate || exp.endDate ? <div className="item-date">{exp.startDate} - {exp.endDate}</div> : null}
                    </div>
                    {exp.description && <div className="item-description">{exp.description}</div>}
                  </div>
                ))}
              </section>
            )}
          </main>
        </>
      )}

      {/* === TECH IT === */}
      {tpl === 'tech-it' && (
        <>
          <div className="header">
            <h1>{fullName || 'Nama Lengkap'}</h1>
            <div className="contact-info">
              {contactItems.map((item, i) => <div key={i}>{item}</div>)}
            </div>
          </div>
          <div className="main-layout">
            <div>
              {summary && (
                <section>
                  <h2>Summary</h2>
                  <p>{summary}</p>
                </section>
              )}
              {experience?.length > 0 && experience[0]?.company && (
                <section>
                  <h2>Experience</h2>
                  {experience.filter(e => e.company).map((exp, i) => (
                    <div key={i} className="experience-item">
                      <div className="item-header">
                        <span>{exp.position}</span>
                        <span className="item-date">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="item-company">{exp.company}</div>
                      {exp.description && <p style={{fontSize:'0.85rem', marginTop:'0.25rem'}}>{exp.description}</p>}
                    </div>
                  ))}
                </section>
              )}
              {education?.length > 0 && education[0]?.institution && (
                <section>
                  <h2>Education</h2>
                  {education.filter(e => e.institution).map((edu, i) => (
                    <div key={i} className="experience-item">
                      <div className="item-header">
                        <span>{edu.degree}</span>
                        <span className="item-date">{edu.startYear} - {edu.endYear}</span>
                      </div>
                      <div className="item-company">{edu.institution}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>
            <aside className="sidebar">
              {skills?.length > 0 && skills[0] && (
                <section>
                  <h2>Skills</h2>
                  <div className="skills-grid">
                    {skills.filter(Boolean).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                  </div>
                </section>
              )}
            </aside>
          </div>
        </>
      )}

      {/* === CORPORATE FINANCE === */}
      {tpl === 'corporate-finance' && (
        <>
          <header className="header">
            <h1>{fullName || 'Nama Lengkap'}</h1>
            <div className="contact-info">
              {contactItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          </header>
          {summary && (
            <section>
              <h2>Executive Summary</h2>
              <p>{summary}</p>
            </section>
          )}
          {experience?.length > 0 && experience[0]?.company && (
            <section>
              <h2>Professional Experience</h2>
              {experience.filter(e => e.company).map((exp, i) => (
                <div key={i} className="experience-item">
                  <div className="item-title">{exp.position}</div>
                  <div className="item-meta">
                    <span>{exp.company}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.description && <p style={{marginTop: '0.25rem', fontSize: '0.875rem'}}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}
          {education?.length > 0 && education[0]?.institution && (
            <section>
              <h2>Education</h2>
              {education.filter(e => e.institution).map((edu, i) => (
                <div key={i} className="experience-item">
                  <div className="item-title">{edu.degree}</div>
                  <div className="item-meta">
                    <span>{edu.institution}</span>
                    <span>{edu.startYear} - {edu.endYear}</span>
                  </div>
                </div>
              ))}
            </section>
          )}
          {skills?.length > 0 && skills[0] && (
            <section>
              <h2>Core Competencies</h2>
              <p>{skills.filter(Boolean).join(' • ')}</p>
            </section>
          )}
        </>
      )}

      {/* === CREATIVE DESIGN === */}
      {tpl === 'creative-design' && (
        <>
          <div className="top-bar"></div>
          <header className="hero">
            <h1>{(fullName || 'Nama Lengkap').toUpperCase()}</h1>
            {summary && <div className="subtitle">{summary.substring(0, 60)}</div>}
          </header>
          <div className="content">
            <div className="left-col">
              {experience?.length > 0 && experience[0]?.company && (
                <section>
                  <h2>Work Experience</h2>
                  {experience.filter(e => e.company).map((exp, i) => (
                    <div key={i} className="experience-item" style={{marginBottom:'1rem'}}>
                      <div style={{fontWeight:700}}>{exp.position}</div>
                      <div className="item-company" style={{color:'#ff4757'}}>{exp.company}</div>
                      <div className="item-date" style={{fontSize:'0.8rem',color:'#888'}}>{exp.startDate} - {exp.endDate}</div>
                      {exp.description && <p style={{fontSize:'0.85rem',marginTop:'0.25rem'}}>{exp.description}</p>}
                    </div>
                  ))}
                </section>
              )}
              {education?.length > 0 && education[0]?.institution && (
                <section>
                  <h2>Education</h2>
                  {education.filter(e => e.institution).map((edu, i) => (
                    <div key={i} className="experience-item" style={{marginBottom:'0.75rem'}}>
                      <div style={{fontWeight:600}}>{edu.degree}</div>
                      <div>{edu.institution} · {edu.startYear} - {edu.endYear}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>
            <div className="right-col">
              <section>
                <h2>Contact</h2>
                {contactItems.map((item, i) => <p key={i} style={{fontSize:'0.875rem'}}>{item}</p>)}
              </section>
              {skills?.length > 0 && skills[0] && (
                <section>
                  <h2>Skills</h2>
                  {skills.filter(Boolean).map((s, i) => <span key={i} className="skill-circle">{s}</span>)}
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { templates, templateIds };