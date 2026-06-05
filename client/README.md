# Client (Frontend)

React 18 + Vite + Tailwind CSS + shadcn/ui. **Authored by: Salman.**

## Quick start

```bash
cp .env.example .env       # then fill VITE_API_URL
npm install
npm run dev                # http://localhost:5173
```

## Folder layout

```
src/
├── assets/           # static images, logos
├── components/
│   ├── ui/           # shadcn-style primitives (Button, Input, Card…)
│   ├── layout/       # Navbar, Sidebar, RoleLayout
│   └── shared/       # Loading, EmptyState, ProtectedRoute
├── pages/            # route-level screens (added per module)
├── services/         # api.js (Axios) + per-resource services
├── store/            # Zustand stores
├── hooks/            # custom React hooks
├── lib/              # cn(), formatters
├── utils/            # misc helpers
├── App.jsx
├── main.jsx
└── index.css
```

## Module roadmap

| # | Module                   | Status      |
|---|--------------------------|-------------|
| 0 | Project foundation       | ✅ done     |
| 1 | Auth & User Management   | ⏳ next     |
| 2 | Patient Profile          | ⏳ pending  |
| … | …                        | ⏳ pending  |
