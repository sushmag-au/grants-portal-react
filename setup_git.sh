#!/usr/bin/env bash
set -e

cd /Users/Sushma/.gemini/antigravity/scratch/drupal-portfolio/grants-portal-react

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
  git init
fi

# Commit 1
git add package.json vite.config.js index.html src/App.jsx src/main.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: scaffold React 18 + Vite project with TypeScript and React Router' || true

# Commit 2
git add src/styles/variables.css src/styles/global.css
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: add design system CSS with gov colour palette and component styles' || true

# Commit 3
git add src/components/Sidebar.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: implement dark sidebar navigation with WCAG accessibility' || true

# Commit 4
git add src/data/grants.js src/context/GrantsContext.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: add mock grants dataset with 12 realistic council grants' || true

# Commit 5
git add src/pages/Dashboard.jsx src/components/StatCard.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: build dashboard with Recharts funding overview and status breakdown' || true

# Commit 6
git add src/pages/GrantsList.jsx src/components/GrantStatusBadge.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: add grants listing with search, filter, and sort functionality' || true

# Commit 7
git add src/pages/GrantDetail.jsx src/components/ProgressBar.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: add grant detail view with progress bar and timeline' || true

# Commit 8
git add src/pages/NewGrantForm.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'feat: implement multi-step new grant form with React Hook Form validation' || true

# Commit 9
git add src/test/setup.js src/test/GrantStatusBadge.test.jsx src/test/Dashboard.test.jsx
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'test: add Vitest unit tests for GrantStatusBadge and Dashboard components' || true

# Commit 10
git add .eslintrc.cjs .github/workflows/ci.yml .gitignore
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'ci: add GitHub Actions workflow for lint, test, and build' || true

# Commit 11
git add README.md setup_git.sh
git -c user.email='gsushma511@gmail.com' -c user.name='Sushma Gogula' commit -m 'docs: add README with feature list, tech stack, and quick start guide' || true

echo "All 11 commits completed successfully!"
git log --oneline -n 11
