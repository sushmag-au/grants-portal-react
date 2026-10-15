import { render, screen } from '@testing-library/react';
import GrantStatusBadge from '../components/GrantStatusBadge';

describe('GrantStatusBadge', () => {
  test('renders active status correctly', () => {
    render(<GrantStatusBadge status="active" />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  test('renders awarded status correctly', () => {
    render(<GrantStatusBadge status="awarded" />);
    expect(screen.getByText(/awarded/i)).toBeInTheDocument();
  });

  test('applies correct class for pending status', () => {
    const { container } = render(<GrantStatusBadge status="pending" />);
    expect(container.firstChild).toHaveClass('badge-pending');
  });
});
