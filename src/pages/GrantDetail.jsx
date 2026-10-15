import React, { useState } from 'react';
import { useParams, useNavigate, useInRouterContext } from 'react-router-dom';
import { useGrants } from '../context/GrantsContext';
import GrantStatusBadge from '../components/GrantStatusBadge';
import ProgressBar from '../components/ProgressBar';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(val || 0);
};

const GrantDetailContent = ({ grantId, navigate, onNavigate }) => {
  const { grants, updateGrant, deleteGrant } = useGrants();
  const [activeTab, setActiveTab] = useState('overview'); // overview | eligibility | timeline | notes
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState([
    {
      id: 1,
      author: 'Sushma Gogula',
      date: '2026-10-10',
      text: 'Preliminary documentation vetted against City of Harborview municipal guidelines. Applicant has confirmed matching funding.'
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const grant = grants.find((g) => g.id === grantId) || grants[0];

  const [editFormData, setEditFormData] = useState(
    grant || {
      title: '',
      fundingBody: '',
      category: '',
      amount: 0,
      status: 'pending',
      description: '',
      eligibility: '',
      contactOfficer: ''
    }
  );

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('/grants');
    } else if (navigate) {
      navigate('/grants');
    }
  };

  const handleMarkAwarded = () => {
    if (!grant) return;
    updateGrant(grant.id, {
      status: 'awarded',
      amountAwarded: grant.amount,
      progress: 100
    });
  };

  const handleArchive = () => {
    if (!grant) return;
    if (window.confirm(`Are you sure you want to archive grant: "${grant.title}"?`)) {
      deleteGrant(grant.id);
      handleBack();
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!grant) return;
    updateGrant(grant.id, editFormData);
    setIsEditing(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      author: 'Sushma Gogula (Grants Officer)',
      date: new Date().toISOString().split('T')[0],
      text: newNote.trim()
    };
    setNotesList((prev) => [note, ...prev]);
    setNewNote('');
  };

  if (!grant) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Grant Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>
          The requested grant reference could not be located in the council registry.
        </p>
        <button className="btn btn-primary" onClick={handleBack}>
          ← Back to Grants Directory
        </button>
      </div>
    );
  }

  // Calculate timeline milestone dates
  const submittedDate = grant.submittedDate || '2026-09-01';
  const deadlineDate = grant.deadline || '2026-11-30';

  return (
    <div className="grant-detail-page">
      {/* Back Button Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className="btn btn-sm btn-secondary"
          onClick={handleBack}
          aria-label="Back to all grants list"
        >
          ← All Grants
        </button>
      </div>

      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <GrantStatusBadge status={grant.status} />
              <span
                style={{
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.6rem',
                  background: '#f1f5f9',
                  borderRadius: '9999px',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600
                }}
              >
                📅 Deadline: {grant.deadline}
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.6rem',
                  background: '#e0f2fe',
                  borderRadius: '9999px',
                  color: '#0369a1',
                  fontWeight: 600
                }}
              >
                Ref #{grant.id}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {grant.title}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Applicant: <strong>{grant.applicant}</strong> • Officer: <strong>{grant.contactOfficer || 'Sarah Mitchell'}</strong>
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              ✏️ {isEditing ? 'Cancel Edit' : 'Edit Grant'}
            </button>
            {grant.status !== 'awarded' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleMarkAwarded}
              >
                🏆 Mark as Awarded
              </button>
            )}
            <button
              className="btn btn-danger btn-sm"
              onClick={handleArchive}
            >
              🗑️ Archive
            </button>
          </div>
        </div>

        {/* Edit Form Modal/Collapse */}
        {isEditing && (
          <form
            onSubmit={handleSaveEdit}
            style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Grant Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Funding Body</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFormData.fundingBody}
                  onChange={(e) => setEditFormData({ ...editFormData, fundingBody: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="awarded">Awarded</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3-Column Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Requested Amount
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.25rem 0' }}>
            {formatCurrency(grant.amount)}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Awarded: {formatCurrency(grant.amountAwarded || 0)}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Category Portfolio
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: '0.5rem 0' }}>
            {grant.category}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            City of Harborview Council Strategic Stream
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Funding Body
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: '0.5rem 0' }}>
            {grant.fundingBody}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Institutional Sponsor & Partner
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>
          Funding Assessment & Delivery Progress
        </h2>
        <ProgressBar
          progress={grant.progress || 35}
          label="Progress toward final disbursement & acquittal"
          height={14}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          <span>Phase: {grant.status === 'awarded' ? 'Completed & Acquitted' : 'Review & Milestone Verification'}</span>
          <span>{grant.progress || 35}% Milestone Completed</span>
        </div>
      </div>

      {/* Tabs / Sections */}
      <div className="card" style={{ padding: 0 }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📝' },
            { id: 'eligibility', label: 'Eligibility & Compliance', icon: '📋' },
            { id: 'timeline', label: 'Milestone Timeline', icon: '⏱️' },
            { id: 'notes', label: `Officer Notes (${notesList.length})`, icon: '💬' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div style={{ padding: '2rem' }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Project Description & Scope
              </h3>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.5rem' }}>
                {grant.description}
              </p>

              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tags & Strategic Themes</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(grant.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Eligibility Criteria & Verification
              </h3>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.5rem' }}>
                {grant.eligibility || 'Standard City of Harborview municipal grant conditions apply. Applicants must hold active ABN, public liability insurance, and reside within the LGA.'}
              </p>

              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem' }}>
                <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>
                  ✓ Governance Compliance Checklist
                </div>
                <ul style={{ paddingLeft: '1.25rem', color: '#15803d', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <li>Valid Victorian Incorporated Association or DGR certification verified</li>
                  <li>Harborview municipality boundaries confirmed</li>
                  <li>No overdue acquittal obligations from prior council funding rounds</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Grant Assessment & Execution Timeline
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>1. Submission Lodged</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0.25rem 0' }}>{submittedDate}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Initial intake & eligibility vetting</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #0057A8' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0057A8', textTransform: 'uppercase' }}>2. Panel Review</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0.25rem 0' }}>2026-10-15</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Independent assessment committee</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>3. Council Decision</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0.25rem 0' }}>{deadlineDate}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Formal council resolution</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #6b7280' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase' }}>4. Reporting & Acquittal</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0.25rem 0' }}>2027-04-30</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Financial audit and impact outcomes</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                Internal Council Officer Notes
              </h3>

              {/* Note addition */}
              <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem' }}>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Record an assessment observation, contact log, or committee question..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  style={{ marginBottom: '0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={!newNote.trim()}>
                  Add Note
                </button>
              </form>

              {/* Notes list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notesList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--color-border)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--color-text)' }}>{item.author}</strong>
                      <span style={{ color: 'var(--color-text-muted)' }}>{item.date}</span>
                    </div>
                    <div style={{ color: '#334155', fontSize: '0.925rem' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GrantDetailWithRouter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <GrantDetailContent grantId={id} navigate={navigate} />;
};

const GrantDetailWithoutRouter = () => {
  const handleNavigate = (path) => {
    if (typeof window !== 'undefined') window.location.href = path;
  };
  return <GrantDetailContent grantId="1" onNavigate={handleNavigate} />;
};

const GrantDetail = () => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <GrantDetailWithRouter />;
  }
  return <GrantDetailWithoutRouter />;
};

export default GrantDetail;
