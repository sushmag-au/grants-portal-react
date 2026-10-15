import React from 'react';

const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendPositive = true,
  description,
  className = ''
}) => {
  return (
    <div className={`stat-card ${className}`.trim()}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div
            className={`stat-trend ${trendPositive ? 'positive' : 'negative'}`}
            aria-label={`Trend: ${trend}`}
          >
            <span>{trendPositive ? '▲' : '▼'}</span>
            <span>{trend}</span>
          </div>
        )}
        {description && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            {description}
          </div>
        )}
      </div>
      {icon && (
        <div className="stat-icon-wrapper" aria-hidden="true">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
