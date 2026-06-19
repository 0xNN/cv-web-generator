# Design Assets — CVLabs

This package contains design tokens and CV template CSS files.

## Contents

- `tokens.css`: Design tokens for spacing, typography, and fonts.
- `templates/`: Specific CV template styles.
  - `classic-professional.css`: A traditional, serif-based elegant design.
  - `modern-minimalist.css`: A clean, sidebar-based modern design.
  - `tech-it.css`: A modern tech-focused design with indigo accents and a two-column layout.
  - `creative-design.css`: A bold, visual-heavy design for creative professionals.
  - `corporate-finance.css`: A clean, conservative design using serif headers and navy/gold accents.

## Usage

Import `tokens.css` first, then the desired template CSS. The CV should be wrapped in a container with the corresponding class names.

### Classic Professional

**Class:** `cv-container classic-professional`

**HTML Structure:**
```html
<div class="cv-container classic-professional">
  <header class="header">
    <h1>John Doe</h1>
    <div class="contact-info">
      <span>Email: john@example.com</span>
      <span>Phone: +1 234 567 890</span>
    </div>
  </header>
  <section>
    <h2>Professional Summary</h2>
    <p>Experienced software engineer...</p>
  </section>
  <!-- More sections... -->
</div>
```

### Modern Minimalist

**Class:** `cv-container modern-minimalist`

**HTML Structure:**
```html
<div class="cv-container modern-minimalist">
  <aside class="sidebar">
    <h1>John Doe</h1>
    <div class="job-title">Senior Developer</div>
    <div class="sidebar-section">
      <h3>Contact</h3>
      <ul class="contact-list">
        <li>john@example.com</li>
      </ul>
    </div>
  </aside>
  <main class="main-content">
    <section class="section">
      <h2>Summary</h2>
      <div class="item-description">Experienced software engineer...</div>
    </section>
  </main>
</div>
```

### Tech/IT

**Class:** `cv-container tech-it`

**HTML Structure:**
```html
<div class="cv-container tech-it">
  <header class="header">
    <h1>John Doe</h1>
    <div class="contact-info">
      <div>john@example.com</div>
      <div>+1 234 567 890</div>
    </div>
  </header>
  <div class="main-layout">
    <main class="main-content">
      <section>
        <h2>Experience</h2>
        <div class="experience-item">
          <div class="item-header">
            <span class="item-title">Senior Developer</span>
            <span class="item-company">Tech Corp</span>
          </div>
          <div class="item-date">2020 - Present</div>
          <ul>
            <li>Led development...</li>
          </ul>
        </div>
      </section>
    </main>
    <aside class="sidebar">
      <h2>Skills</h2>
      <div class="skills-grid">
        <span class="skill-tag">React</span>
        <span class="skill-tag">Node.js</span>
      </div>
    </aside>
  </div>
</div>
```

### Creative/Design

**Class:** `cv-container creative-design`

**HTML Structure:**
```html
<div class="cv-container creative-design">
  <div class="top-bar"></div>
  <header class="hero">
    <h1>JOHN DOE</h1>
    <div class="subtitle">Art Director & Brand Strategist</div>
  </header>
  <div class="content">
    <div class="left-col">
      <section>
        <h2>Work Experience</h2>
        <!-- items -->
      </section>
    </div>
    <div class="right-col">
      <section>
        <h2>Contact</h2>
        <p>hello@johndoe.design</p>
        <a href="#" class="portfolio-link">VIEW PORTFOLIO</a>
      </section>
      <section>
        <h2>Skills</h2>
        <span class="skill-circle">Figma</span>
      </section>
    </div>
  </div>
</div>
```

### Corporate/Finance

**Class:** `cv-container corporate-finance`

**HTML Structure:**
```html
<div class="cv-container corporate-finance">
  <header class="header">
    <h1>JOHN DOE</h1>
    <div class="contact-info">
      <span>john.doe@finance.com</span>
      <span>+1 555 1234</span>
    </div>
  </header>
  <section>
    <h2>Executive Summary</h2>
    <p>Financial Analyst with 10+ years...</p>
  </section>
  <section>
    <h2>Professional Experience</h2>
    <div class="experience-item">
      <div class="item-title">VP OF FINANCE</div>
      <div class="item-meta">
        <span>Global Bank</span>
        <span>2015 - Present</span>
      </div>
      <ul>
        <li>Managed portfolio...</li>
      </ul>
    </div>
  </section>
</div>
```

### Design Tokens

We use a common set of spacing and typography tokens defined in `tokens.css`.
- Spacing: `--space-xs` to `--space-xxl`
- Typography: `--font-xs` to `--font-xxxl`
- Fonts: `--font-sans`, `--font-serif`
