# GrantsPortal — Council Grants Management Dashboard

[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12.7-22C55E?style=flat)](https://recharts.org/)
[![Accessibility](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-blue?style=flat)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A production-grade Single Page Application (SPA) built for municipal grants administration, community funding assessment, and strategic pipeline tracking for the **City of Greater Geelong, Australia**. Designed as a senior developer portfolio project demonstrating government-standard accessibility (WCAG 2.1 AA), responsive visual analytics, and strict form governance.

---

## 🏛️ Context & Municipal Purpose

GrantsPortal addresses the complex lifecycle of local government community investments across Geelong, the Bellarine Peninsula, Corio, and regional growth corridors. Council officers and assessment panels require unified oversight over:
- Multi-tier funding streams (Environment, Arts & Culture, Sports, Infrastructure, Economic Development).
- Compliance vetting, milestone deliverables, and budget acquittal.
- Proactive deadline tracking with risk-rated countdown alerts.
- High-level executive reporting on community fund distribution.

---

## 📸 Screenshots & UI Aesthetics

```
+-----------------------------------------------------------------------------------------+
| [🏛️ GrantsPortal]  | Grants Management Overview               [ + Submit New Grant ]    |
| City of Greater    | ------------------------------------------------------------------ |
| Geelong            | [ Total Grants: 12 ] [ Active: 5 ] [ Pipeline: $1.2M ] [ Awarded: 3|
|                    |                                                                    |
| [📊 Dashboard]    |  Funding Overview (BarChart)          Status Breakdown (Donut)     |
| [📋 All Grants]   |  +---------------------------+        +--------------------------+ |
| [➕ New Grant]     |  | Requested vs Awarded      |        | Active / Pending / Closed| |
|                    |  +---------------------------+        +--------------------------+ |
|                    |                                                                    |
| [👤 Sushma G.]    |  Recent Submissions Table & 30-Day Deadline Alerts                 |
+-----------------------------------------------------------------------------------------+
```

---

## ✨ Key Features

1. **Executive Analytics Dashboard**
   - **Key Metrics Row**: Total grants count, active rounds, cumulative portfolio value ($1.2M+), and disbursed funds.
   - **Funding Trends**: Recharts bar chart tracking requested vs. awarded funding across historical monthly quarters.
   - **Status Breakdown**: Interactive donut chart showcasing active, pending, awarded, and closed portfolios.
   - **Urgent Action Alerts**: Highlighted alert banners for grant rounds closing within 30 days.

2. **Grants Directory & Filtering**
   - Real-time search across titles, applicants, funding bodies, descriptions, and tags.
   - Dual-axis dropdown filtering by Category and Status.
   - Multi-criteria sorting (Deadline soonest/latest, Amount highest/lowest, Date submitted, Title A-Z).
   - Zero-state fallback UI and dynamic record counters.

3. **In-Depth Grant Lifecycle Dossier**
   - Financial breakdown cards (Amount requested vs. awarded).
   - Dynamic animated progress meter tracking assessment and acquittal stages.
   - Tabbed workspace: **Overview**, **Eligibility & Compliance**, **Milestone Timeline**, and **Officer Notes**.
   - Direct lifecycle actions: *Edit Grant*, *Mark as Awarded*, and *Archive*.

4. **Multi-Step Intake Form with React Hook Form**
   - **Step 1: Basic Info** — Title, applicant, funding body, category, amount (> $0), and deadline (future date validation).
   - **Step 2: Details** — Strategic description, eligibility guidelines, and assigned contact officer.
   - **Step 3: Review** — Consolidated verification summary card before ledger registration.
   - Visual progress stepper with state persistence and accessible error messaging.

5. **WCAG 2.1 AA Government Accessibility**
   - Accessible skip-to-content navigation (`.skip-link`).
   - Screen-reader accessible utility classes (`.sr-only`).
   - High-contrast government color palette (#0057A8 blue, #F5A623 amber, #10B981 green).
   - Keyboard navigable tables, tabs, and focus-visible indicators.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Version | Description |
|---|---|---|---|
| **Framework** | React | `^18.3.1` | Concurrent rendering, strict state segregation |
| **Bundler** | Vite | `^5.3.4` | Ultra-fast HMR and optimized production bundling |
| **Routing** | React Router DOM | `^6.24.0` | Declarative client-side routing & deep linking |
| **Form Engine** | React Hook Form | `^7.52.0` | Performant, uncontrolled form validation |
| **Visualizations** | Recharts | `^2.12.7` | Declarative SVG bar charts and donut distributions |
| **Design Tokens** | CSS Custom Properties | Native | Scalable design system with Geelong theme |
| **Test Runner** | Vitest + JSDOM | `^2.0.3` | Native ESM unit testing suite |
| **Assertions** | @testing-library/react | `^16.0.0` | User-centric DOM testing utilities |
| **CI / CD** | GitHub Actions | v4 | Automated linting, test runner, and production build |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20 LTS recommended)
- **npm**: v9.0.0 or higher

### Installation & Launch

```bash
# Clone or navigate to the repository
cd /Users/Sushma/.gemini/antigravity/scratch/drupal-portfolio/grants-portal-react

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be accessible at: `http://localhost:5173`

### Production Build

```bash
# Create optimized production build in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🧭 Application Routes

| Path | View / Component | Description |
|---|---|---|
| `/` | `Dashboard.jsx` | Executive KPI cards, Recharts visualizations, urgent alerts |
| `/grants` | `GrantsList.jsx` | Comprehensive grants directory with search, filter, and sorting |
| `/grants/:id` | `GrantDetail.jsx` | Detail dossier, funding progress bar, tabs, and actions |
| `/grants/new` | `NewGrantForm.jsx` | Multi-step intake wizard with React Hook Form validation |

---

## 🧪 Testing Suite

Tests are built with **Vitest** and **React Testing Library**:

```bash
# Execute unit tests
npm test

# Run tests in watch mode
npx vitest
```

### Included Tests:
- `src/test/GrantStatusBadge.test.jsx`: Validates badge rendering, status normalization, and CSS class bindings.
- `src/test/Dashboard.test.jsx`: Validates statistics card presence, overview rendering, and municipal header.

---

## 🔄 CI/CD Automation

Automated pipeline via `.github/workflows/ci.yml`:
1. Checkout repository on Ubuntu latest.
2. Setup Node.js 20 with npm caching.
3. Strict dependency installation (`npm ci`).
4. Static code analysis (`npm run lint`).
5. Vitest execution (`npm test`).
6. Production bundle build validation (`npm run build`).

---

## 👩‍💻 Lead Developer & Author

**Sushma Gogula**  
*Senior Full Stack / React Developer*  
Portfolio Project for Senior Role (Band 7) — City of Greater Geelong, Victoria, Australia.
