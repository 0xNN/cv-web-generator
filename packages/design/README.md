# Design Assets — CVLabs

This package contains design tokens and CV template CSS files.

## Contents

- `tokens.css`: Design tokens for spacing, typography, and fonts.
- `templates/`: Specific CV template styles.
  - `classic-professional.css`: A traditional, serif-based elegant design.
  - `modern-minimalist.css`: A clean, sidebar-based modern design.

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

### Design Tokens

We use a common set of spacing and typography tokens defined in `tokens.css`.
- Spacing: `--space-xs` to `--space-xxl`
- Typography: `--font-xs` to `--font-xxxl`
- Fonts: `--font-sans`, `--font-serif`