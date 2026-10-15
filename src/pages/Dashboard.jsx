import React, { useMemo } from 'react';
import { useInRouterContext, useNavigate, Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useGrants } from '../context/GrantsContext';
import { MONTHLY_FUNDING_DATA } from '../data/grants';
import StatCard from '../components/StatCard';
import GrantStatusBadge from '../components/GrantStatusBadge';

const STATUS_COLORS = {
  active: '#0057A8',
  pending: '#F5A623',
  awarded: '#10B981',
  closed: '#94A3B8'
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(val);
};

const DashboardContent = ({ navigate, onNavigate }) => {
  const { grants } = useGrants();

  // 1. Stats calculation
  const stats = useMemo(() => {
    const total = grants.length;
    const active = grants.filter((g) => g.status === 'active').length;
    const awarded = grants.filter((g) => g.status === 'awarded').length;
    const totalVal = grants.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const awardedVal = grants
      .filter((g) => g.status === 'awarded')
      .reduce((acc, curr) => acc + (Number(curr.amountAwarded) || Number(curr.amount) || 0), 0);

    return {
      total,
      active,
      awarded,
      totalValFormatted: `$${(totalVal / 1000000).toFixed(1)}M`,
      awardedValFormatted: formatCurrency(awardedVal)
    };
  }, [grants]);

  // 2. Status breakdown data for donut chart
  const statusPieData = useMemo(() => {
    const counts = { active: 0, pending: 0, awarded: 0, closed: 0 };
    grants.forEach((g) => {
      const st = (g.status || 'pending').toLowerCase();
      if (counts[st] !== undefined) counts[st]++;
    });

    return [
      { name: 'Active', value: counts.active, key: 'active', color: STATUS_COLORS.active },
      { name: 'Pending Review', value: counts.pending, key: 'pending', color: STATUS_COLORS.pending },
      { name: 'Awarded', value: counts.awarded, key: 'awarded', color: STATUS_COLORS.awarded },
      { name: 'Closed', value: counts.closed, key: 'closed', color: STATUS_COLORS.closed }
    ].filter((item) => item.value > 0);
  }, [grants]);

  // 3. Deadline alerts (closing within 30 days)
  const deadlineAlerts = useMemo(() => {
    // Reference date set to current date or October 2026
    const now = new Date();
    return grants
      .filter((g) => g.status === 'active' || g.status === 'pending')
      .map((g) => {
        const d = new Date(g.deadline);
        const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        return { ...g, diffDays };
      })
      .filter((g) => g.diffDays >= 0 && g.diffDays <= 30)
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [grants]);

  // 4. Recent activity (last 5 grants sorted by submittedDate)
  const recentGrants = useMemo(() => {
    return [...grants]
      .sort((a, b) => new Date(b.submittedDate || 0) - new Date(a.submittedDate || 0))
      .slice(0, 5);
  }, [grants]);

  const handleRowClick = (id) => {
    if (onNavigate) {
      onNavigate(`/grants/${id}`);
    } else if (navigate) {
      navigate(`/grants/${id}`);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Grants Management Overview
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            City of Harborview • Strategic Community Investment & Governance
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => (onNavigate ? onNavigate('/grants/new') : navigate ? navigate('/grants/new') : null)}
        >
          <span>➕</span> Submit New Grant
        </button>
      </div>

      {/* 1. Stats Row */}
      <section aria-label="Key Grant Metrics" className="stat-card-grid">
        <StatCard
          icon="📋"
          label="Total Grants"
          value={stats.total}
          trend="+12% vs last quarter"
          trendPositive={true}
        />
        <StatCard
          icon="⚡"
          label="Active Grants"
          value={stats.active}
          trend="5 currently open"
          trendPositive={true}
        />
        <StatCard
          icon="💰"
          label="Total Pipeline Value"
          value={stats.totalValFormatted}
          trend="+8% y-o-y"
          trendPositive={true}
        />
        <StatCard
          icon="🏆"
          label="Awarded This Year"
          value={stats.awarded}
          description={`${stats.awardedValFormatted} disbursed`}
          trendPositive={true}
        />
      </section>

      {/* Deadline Alerts */}
      {deadlineAlerts.length > 0 && (
        <section aria-label="Urgent Grant Deadlines" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> Deadlines Closing Soon (Next 30 Days)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {deadlineAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-card ${alert.diffDays <= 14 ? 'danger' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleRowClick(alert.id)}
              >
                <div>
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-desc">
                    {alert.category} • Closing in <strong>{alert.diffDays} day{alert.diffDays === 1 ? '' : 's'}</strong> ({alert.deadline})
                  </div>
                </div>
                <span className="btn btn-sm btn-secondary">Review</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Funding Overview Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Funding Overview (Last 6 Months)</div>
              <div className="card-subtitle">Requested budget vs. Awarded community funding</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_FUNDING_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', border: 'none' }}
                />
                <Legend wrapperStyle={{ paddingTop: '8px' }} />
                <Bar dataKey="totalRequested" name="Requested ($)" fill="#0057A8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalAwarded" name="Awarded ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Status Breakdown</div>
              <div className="card-subtitle">Portfolio distribution across lifecycle stages</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {statusPieData.map((entry) => (
                    <Cell key={`cell-${entry.key}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Grants`, name]}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', border: 'none' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h2 className="card-title">Recent Grant Submissions</h2>
            <p className="card-subtitle">Last 5 grants submitted across Harborview municipal categories</p>
          </div>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => (onNavigate ? onNavigate('/grants') : navigate ? navigate('/grants') : null)}
          >
            View All Grants ({grants.length}) →
          </button>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="grants-table" aria-label="Recent Grants">
            <thead>
              <tr>
                <th scope="col">Grant Title</th>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {recentGrants.map((grant) => (
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
                  <td>{grant.category}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(grant.amount)}</td>
                  <td>
                    <GrantStatusBadge status={grant.status} />
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{grant.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Router-safe wrapper to allow rendering both inside BrowserRouter and directly in unit tests
const DashboardWithRouter = (props) => {
  const navigate = useNavigate();
  return <DashboardContent navigate={navigate} {...props} />;
};

const DashboardWithoutRouter = (props) => {
  const handleNavigate = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };
  return <DashboardContent onNavigate={handleNavigate} {...props} />;
};

const Dashboard = (props) => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <DashboardWithRouter {...props} />;
  }
  return <DashboardWithoutRouter {...props} />;
};

export default Dashboard;
