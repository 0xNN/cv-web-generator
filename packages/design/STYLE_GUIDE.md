# CVLabs Design Style Guide

This document defines the visual identity and structural requirements for CVLabs templates.

## Design Tokens

We use a standardized set of tokens for consistency across all templates. These are defined in `tokens.css`.

### Color Palette Basics
- **Primary**: Main brand or accent color for a template.
- **Secondary**: Supporting accent or header color.
- **Text Main**: Primary color for body text (usually `#333333` or `#1a1a1a`).
- **Text Muted**: Color for less important text or metadata (`#666666` or similar).
- **Border**: Color for dividers and borders.

### Spacing
- `var(--space-xs)`: 0.25rem (4px)
- `var(--space-sm)`: 0.5rem (8px)
- `var(--space-md)`: 1rem (16px)
- `var(--space-lg)`: 1.5rem (24px)
- `var(--space-xl)`: 2rem (32px)
- `var(--space-xxl)`: 3rem (48px)

### Typography
- **Font Sans**: 'Inter', system-ui, -apple-system, sans-serif
- **Font Serif**: 'Merriweather', Georgia, serif
- **Base Size**: 16px (1rem)
- **Scale**:
  - `var(--font-xs)`: 0.75rem
  - `var(--font-sm)`: 0.875rem
  - `var(--font-md)`: 1.125rem
  - `var(--font-lg)`: 1.25rem
  - `var(--font-xl)`: 1.5rem
  - `var(--font-xxl)`: 2rem
  - `var(--font-xxxl)`: 2.5rem

---

## Template Catalog

### 1. Classic Professional
- **ID**: `classic-professional`
- **Style**: Elegant, traditional, serif-based.
- **Best for**: Law, Education, Senior Management.
- **Primary Color**: `#2c3e50` (Navy)
- **Typography**: Serif (`Merriweather`) for all content.

#### HTML Structure
```html
<div class="cv-container classic-professional">
  <header class="header">
    <h1>[Name]</h1>
    <div class="contact-info">
      <span>[Email]</span> | <span>[Phone]</span>
    </div>
  </header>
  <section>
    <h2>Professional Summary</h2>
    <p>[Summary Content]</p>
  </section>
  <section>
    <h2>Experience</h2>
    <div class="experience-item">
      <div class="item-header">
        <span class="item-title">[Job Title]</span>
        <span class="item-date">[Date Range]</span>
      </div>
      <div class="item-subtitle">[Company Name]</div>
      <ul>
        <li>[Achievement]</li>
      </ul>
    </div>
  </section>
</div>
```

### 2. Modern Minimalist
- **ID**: `modern-minimalist`
- **Style**: Clean, asymmetrical with sidebar.
- **Best for**: Startups, Marketing, General Business.
- **Primary Color**: `#1a1a1a` with `#007bff` (Blue) accents.
- **Typography**: Sans-serif (`Inter`).

#### HTML Structure
```html
<div class="cv-container modern-minimalist">
  <aside class="sidebar">
    <h1>[Name]</h1>
    <div class="job-title">[Current Role]</div>
    <div class="sidebar-section">
      <h3>Contact</h3>
      <ul class="contact-list">
        <li>[Email]</li>
      </ul>
    </div>
  </aside>
  <main class="main-content">
    <section class="section">
      <h2>Experience</h2>
      <div class="experience-item">
        <div class="item-header">
          <div class="item-title">[Job Title]</div>
          <div class="item-subtitle">[Company]</div>
          <div class="item-date">[Date]</div>
        </div>
        <p class="item-description">[Content]</p>
      </div>
    </section>
  </main>
</div>
```

### 3. Tech/IT
- **ID**: `tech-it`
- **Style**: High-contrast, tech-focused with grid layout.
- **Best for**: Software Engineering, Data Science, IT Support.
- **Primary Color**: `#6366f1` (Indigo).
- **Typography**: Sans-serif (`Inter`).

### 4. Creative/Design
- **ID**: `creative-design`
- **Style**: Bold, visual-heavy with unique hero section.
- **Best for**: Graphic Design, UI/UX, Arts, Media.
- **Primary Color**: `#ff4757` (Coral).
- **Typography**: Heavy sans-serif.

### 5. Corporate/Finance
- **ID**: `corporate-finance`
- **Style**: Conservative, high-end using navy and gold accents.
- **Best for**: Investment Banking, Accounting, Finance.
- **Primary Color**: `#1b263b` (Navy) & `#c29731` (Gold).
- **Typography**: Serif headers with Sans-serif body.

---

## Responsive Guidelines

1. **Max Width**: All templates should be optimized for A4 width (approx 800px-900px) but must be responsive.
2. **Breakpoints**:
   - `< 768px`: Sidebars (in Modern Minimalist & Tech/IT) should stack vertically.
   - `< 480px`: Padding should reduce to `var(--space-md)`, fonts may scale down slightly.
3. **Print CSS**: Ensure backgrounds and colors are preserved or optimized for printing (using `@media print`).

## Implementation Checklist for Frontend
- [ ] Wrapper class `cv-container` must be present.
- [ ] Template-specific class (e.g., `tech-it`) must be added to the wrapper.
- [ ] Tokens from `tokens.css` should be used for all spacing and common values.
- [ ] SVG icons are preferred for contact details.
