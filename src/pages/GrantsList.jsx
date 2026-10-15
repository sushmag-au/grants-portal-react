import React, { useState, useMemo } from 'react';
import { useInRouterContext, useNavigate, Link } from 'react-router-dom';
import { useGrants } from '../context/GrantsContext';
import { CATEGORIES, STATUSES } from '../data/grants';
import GrantStatusBadge from '../components/GrantStatusBadge';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(val);
};

const GrantsListContent = ({ navigate, onNavigate }) => {
  const { grants } = useGrants();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('submitted-desc');

  const filteredGrants = useMemo(() => {
    return grants.filter((grant) => {
      // Category filter
      if (selectedCategory !== 'All' && grant.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'All' && grant.status !== selectedStatus) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = grant.title?.toLowerCase().includes(q);
        const matchesApplicant = grant.applicant?.toLowerCase().includes(q);
        const matchesFunding = grant.fundingBody?.toLowerCase().includes(q);
        const matchesDescription = grant.description?.toLowerCase().includes(q);
        const matchesTags = grant.tags?.some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesApplicant && !matchesFunding && !matchesDescription && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline-asc') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'deadline-desc') {
        return new Date(b.deadline) - new Date(a.deadline);
      }
      if (sortBy === 'amount-desc') {
        return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      }
      if (sortBy === 'amount-asc') {
        return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'submitted-desc') {
        return new Date(b.submittedDate || 0) - new Date(a.submittedDate || 0);
      }
      return 0;
    });
  }, [grants, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const handleRowClick = (id) => {
    if (onNavigate) {
      onNavigate(`/grants/${id}`);
    } else if (navigate) {
      navigate(`/grants/${id}`);
    }
  };

  const handleNewGrant = () => {
    if (onNavigate) {
      onNavigate('/grants/new');
    } else if (navigate) {
      navigate('/grants/new');
    }
  };

  return (
    <div className="grants-list-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            All Council Grants
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Comprehensive directory of Geelong community, capital works, and cultural grants
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleNewGrant}>
          <span>➕</span> New Grant
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Search Input */}
          <div>
            <label htmlFor="grant-search" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Search Grants
            </label>
            <input
              id="grant-search"
              type="text"
              className="form-control"
              placeholder="Search by title, applicant, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="filter-category" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Category
            </label>
            <select
              id="filter-category"
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="filter-status" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Status
            </label>
            <select
              id="filter-status"
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label htmlFor="sort-grants" style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Sort By
            </label>
            <select
              id="sort-grants"
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="submitted-desc">Newest Submitted</option>
              <option value="deadline-asc">Deadline (Soonest First)</option>
              <option value="deadline-desc">Deadline (Latest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Count summary & Reset filters */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <div>
            Showing <strong>{filteredGrants.length}</strong> of <strong>{grants.length}</strong> grants
          </div>
          {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table of Grants */}
      <div className="card" style={{ padding: 0 }}>
        {filteredGrants.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
              No matching grants found
            </h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
              Try adjusting your search criteria, category or status filters to discover available funding opportunities.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="grants-table" aria-label="Geelong Council Grants Directory">
              <thead>
                <tr>
                  <th scope="col">Title & Applicant</th>
                  <th scope="col">Funding Body</th>
                  <th scope="col">Category</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Deadline</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrants.map((grant) => (
                  <tr
                    key={grant.id}
                    onClick={() => handleRowClick(grant.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRowClick(grant.id);
                      }
                    }}
                    aria-label={`View details for ${grant.title}`}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{grant.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{grant.applicant}</div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{grant.fundingBody}</td>
                    <td>
                      <span style={{ fontSize: '0.825rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', borderRadius: '4px' }}>
                        {grant.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(grant.amount)}</td>
                    <td>
                      <GrantStatusBadge status={grant.status} />
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{grant.deadline}</td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleRowClick(grant.id)}
                          aria-label={`View grant ${grant.title}`}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const GrantsListWithRouter = (props) => {
  const navigate = useNavigate();
  return <GrantsListContent navigate={navigate} {...props} />;
};

const GrantsListWithoutRouter = (props) => {
  const handleNavigate = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };
  return <GrantsListContent onNavigate={handleNavigate} {...props} />;
};

const GrantsList = (props) => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <GrantsListWithRouter {...props} />;
  }
  return <GrantsListWithoutRouter {...props} />;
};

export default GrantsList;
