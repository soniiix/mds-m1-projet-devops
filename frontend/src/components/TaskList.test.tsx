import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from './TaskList';
import { Task } from '../api/tasks.api';

describe('TaskList Component', () => {
  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: 'Desc 1', status: 'todo', createdAt: new Date().toISOString() },
    { id: '2', title: 'Task 2', description: 'Desc 2', status: 'done', createdAt: new Date().toISOString() },
  ];

  it('renders "No tasks" message when list is empty', () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('renders a list of tasks', () => {
    render(<TaskList tasks={mockTasks} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(<TaskList tasks={mockTasks} onToggle={onToggle} onDelete={vi.fn()} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<TaskList tasks={mockTasks} onToggle={vi.fn()} onDelete={onDelete} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
