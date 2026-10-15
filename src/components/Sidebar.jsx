import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/grants', label: 'All Grants', icon: '📋' },
  { path: '/grants/new', label: 'New Grant', icon: '➕' }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand" onClick={onClose}>
            <div className="sidebar-logo" aria-hidden="true">
              🏛️
            </div>
            <div className="sidebar-title-group">
              <h1>GrantsPortal</h1>
              <div className="sidebar-subtitle">City of Greater Geelong</div>
            </div>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              onClick={onClose}
            >
              <span className="sidebar-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar" title="Sushma Gogula">
              SG
            </div>
            <div className="user-info">
              <span className="user-name">Sushma G.</span>
              <span className="user-role">Grants Officer</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
