import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskStatsComponent } from './TaskStats';

describe('TaskStatsComponent', () => {
  const mockStats = {
    total: 10,
    todo: 7,
    done: 3,
    completionRate: 30,
  };

  it('renders all stat values correctly', () => {
    render(<TaskStatsComponent stats={mockStats} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('renders labels correctly', () => {
    render(<TaskStatsComponent stats={mockStats} />);
    
    expect(screen.getByText(/Total Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/To Do/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Completion Rate/i)).toBeInTheDocument();
  });
});
