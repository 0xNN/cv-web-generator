# CVLabs — Buat CV Profesional dalam Hitungan Menit

CVLabs is a web application that helps users create professional CVs quickly. Fill in your data, choose a general or industry-specific template, let AI refine your content, and download as PDF.

## Project Structure

```
cvlabs/
├── packages/
│   ├── frontend/     — Vite + React web app
│   ├── backend/      — Node.js + Express API
│   └── design/       — CSS templates, tokens, and design assets
├── package.json      — Root monorepo workspace config
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install Dependencies

```bash
npm install
```

### Run Development Servers

**Frontend (Vite dev server on :5173):**
```bash
npm run dev:frontend
```

**Backend (Express API on :3000):**
```bash
npm run dev:backend
```

### Build for Production

```bash
npm run build:frontend
```

## Tech Stack

- **Frontend:** Vite + React 19, React Router 7
- **Backend:** Node.js + Express, JWT auth, Turso/SQLite
- **Design:** Custom CSS tokens, template styles

## License

MIT