import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from './TaskForm';

describe('TaskForm Component', () => {
  it('renders input fields correctly', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('updates state when typing', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const titleInput = screen.getByPlaceholderText(/Task title/i) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Buy milk' } });
    expect(titleInput.value).toBe('Buy milk');
  });

  it('calls onSubmit with correct data and clears inputs', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    
    const titleInput = screen.getByPlaceholderText(/Task title/i);
    const descInput = screen.getByPlaceholderText(/Description/i);
    const submitBtn = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descInput, { target: { value: 'Some desc' } });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith('New Task', 'Some desc');
    expect((titleInput as HTMLInputElement).value).toBe('');
    expect((descInput as HTMLInputElement).value).toBe('');
  });

  it('does not call onSubmit if title is empty', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    
    const submitBtn = screen.getByText('Add Task');
    fireEvent.click(submitBtn);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
