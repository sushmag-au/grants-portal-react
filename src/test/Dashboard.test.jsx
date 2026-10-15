import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

describe('Dashboard', () => {
  test('renders total grants stat card', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Grants')).toBeInTheDocument();
  });

  test('renders active grants metric', () => {
    render(<Dashboard />);
    expect(screen.getByText('Active Grants')).toBeInTheDocument();
  });

  test('renders municipal dashboard header', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Grants Management Overview/i)).toBeInTheDocument();
  });
});
