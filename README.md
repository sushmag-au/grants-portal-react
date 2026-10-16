# GrantsHub — Community Grants Management Dashboard

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://grants-portal-react.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf?style=flat-square)](https://recharts.org)
[![WCAG](https://img.shields.io/badge/WCAG%202.1-AA-0057A8?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Tests](https://img.shields.io/badge/Vitest-6%2F6%20passing-success?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> 🚀 **Live Demo:** [https://grants-portal-react.vercel.app](https://grants-portal-react.vercel.app/)

A modern **React 18 SPA** for managing community grants programs. Built with Vite, React Router v6, Recharts data visualisation, and React Hook Form — demonstrating real-world React patterns for data-heavy dashboards.

## Features

- **Dashboard** — KPI stat cards, Recharts BarChart (monthly funding), PieChart (status breakdown), deadline alerts
- **Grants Directory** — searchable, filterable table with sort controls across 12 sample grants
- **Grant Detail** — animated progress bar, tabbed sections (overview, eligibility, timeline, notes)
- **Multi-step Form** — 3-step new grant intake using React Hook Form with full validation
- **State management** — React Context + localStorage persistence
- **Accessibility** — WCAG 2.1 AA, keyboard nav, skip links, aria labels, focus management
- **Dark sidebar** — persistent navigation with active state and role indicator

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI Library | React 18 |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| Forms | React Hook Form 7 |
| Charts | Recharts 2 |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

## Routes

| Route | Page |
|-------|------|
| `/` | Dashboard — KPIs, charts, recent activity |
| `/grants` | Grants directory — search, filter, sort |
| `/grants/:id` | Grant detail — progress, timeline, actions |
| `/grants/new` | Multi-step new grant intake form |

## Quick Start

```bash
git clone https://github.com/sushmag-au/grants-portal-react.git
cd grants-portal-react
npm install
npm run dev       # http://localhost:5173
```

## Testing

```bash
npm test          # Vitest — 6 unit tests
npm run build     # Production build verification
```

Tests cover `GrantStatusBadge` component rendering and `Dashboard` stat card rendering.

## CI/CD

GitHub Actions runs on every push to `main`:
- ESLint — code quality
- Vitest — unit tests (6/6)
- Vite build — production build verification

## Developer

**Sushma Gogula** — [github.com/sushmag-au](https://github.com/sushmag-au) · [linkedin.com/in/gsushma-au](https://linkedin.com/in/gsushma-au)
