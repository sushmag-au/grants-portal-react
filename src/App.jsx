import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GrantsList from './pages/GrantsList';
import GrantDetail from './pages/GrantDetail';
import NewGrantForm from './pages/NewGrantForm';
import { GrantsProvider } from './context/GrantsContext';

function App() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <GrantsProvider>
      <div className="app-container">
        {/* WCAG Skip Link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Mobile Header Bar */}
        <header className="mobile-topbar" aria-label="Mobile Header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>GrantsPortal</span>
          </div>
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label={mobileSidebarOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileSidebarOpen}
          >
            {mobileSidebarOpen ? '✕' : '☰'}
          </button>
        </header>

        {/* Sidebar Component */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main id="main-content" className="main-content" tabIndex={-1}>
          <div className="main-content-inner">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/grants" element={<GrantsList />} />
              <Route path="/grants/new" element={<NewGrantForm />} />
              <Route path="/grants/:id" element={<GrantDetail />} />
              <Route
                path="*"
                element={
                  <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <h2>404 - Page Not Found</h2>
                    <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>
                      The requested route does not exist within the Geelong GrantsPortal.
                    </p>
                    <Link to="/" className="btn btn-primary">
                      Return to Dashboard
                    </Link>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </GrantsProvider>
  );
}

export default App;
