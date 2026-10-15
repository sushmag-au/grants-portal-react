import React, { useState, useEffect } from 'react';

const ProgressBar = ({
  progress = 0,
  label = 'Funding Progress',
  showLabel = true,
  height = 10,
  variant = 'primary', // 'primary' | 'warning' | 'success'
  className = ''
}) => {
  const [width, setWidth] = useState(0);

  // Animate progress on component mount / value change
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.min(100, Math.max(0, progress)));
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getVariantClass = () => {
    if (variant === 'success' || width >= 100) return 'success';
    if (variant === 'warning' || (width > 0 && width < 40)) return 'warning';
    return '';
  };

  return (
    <div className={`progress-container ${className}`.trim()}>
      {showLabel && (
        <div className="progress-header">
          <span>{label}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>{width}%</span>
        </div>
      )}
      <div
        className="progress-bar-track"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label}
      >
        <div
          className={`progress-bar-fill ${getVariantClass()}`.trim()}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
