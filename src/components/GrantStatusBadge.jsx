import React from 'react';

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    dotColor: '#0284c7'
  },
  pending: {
    label: 'Pending',
    dotColor: '#d97706'
  },
  awarded: {
    label: 'Awarded',
    dotColor: '#059669'
  },
  closed: {
    label: 'Closed',
    dotColor: '#6b7280'
  }
};

const GrantStatusBadge = ({ status = 'pending', className = '' }) => {
  const normalizedStatus = (status || 'pending').toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || {
    label: status,
    dotColor: '#6b7280'
  };

  return (
    <span
      className={`badge badge-${normalizedStatus} ${className}`.trim()}
      data-testid={`badge-${normalizedStatus}`}
    >
      <span
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.dotColor,
          marginRight: '4px'
        }}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
};

export default GrantStatusBadge;
