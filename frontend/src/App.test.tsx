import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from './App';
import * as api from './api/tasks.api';

// No need to vi.mock here if it's already in setup.ts, 
// but we need to cast to Mock to use mock methods if needed, 
// or just used the mocked versions directly.
const { fetchTasks, fetchStats, createTask, deleteTask, toggleTask } = api as any;

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTasks = [
    { id: '1', title: 'Task 1', description: 'Desc 1', status: 'todo', createdAt: new Date().toISOString() },
    { id: '2', title: 'Task 2', description: 'Desc 2', status: 'done', createdAt: new Date().toISOString() },
  ];

  const mockStats = {
    total: 2,
    todo: 1,
    done: 1,
    completionRate: 50,
  };

  it('renders the title and initial state', async () => {
    fetchTasks.mockResolvedValueOnce([]);
    fetchStats.mockResolvedValueOnce(mockStats);

    render(<App />);
    
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Microservices Demo Project/i)).toBeInTheDocument();
  });

  it('loads and displays tasks', async () => {
    fetchTasks.mockResolvedValueOnce(mockTasks);
    fetchStats.mockResolvedValueOnce(mockStats);

    render(<App />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('displays an error message when API fails', async () => {
    fetchTasks.mockRejectedValueOnce(new Error('API Error'));
    fetchStats.mockResolvedValueOnce(mockStats);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load tasks/i)).toBeInTheDocument();
    });
  });

  it('filters tasks when clicking filter buttons', async () => {
    fetchTasks.mockResolvedValue(mockTasks);
    fetchStats.mockResolvedValue(mockStats);

    render(<App />);

    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

    const todoButton = screen.getByRole('button', { name: 'To Do' });
    fireEvent.click(todoButton);

    await waitFor(() => {
      expect(fetchTasks).toHaveBeenCalledWith('todo');
    });

    const doneButton = screen.getByRole('button', { name: 'Completed' });
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(fetchTasks).toHaveBeenCalledWith('done');
    });
  });

  it('handles task creation', async () => {
    fetchTasks.mockResolvedValue(mockTasks);
    fetchStats.mockResolvedValue(mockStats);
    createTask.mockResolvedValueOnce({ id: '3', title: 'New Task', status: 'todo', createdAt: new Date().toISOString() });

    render(<App />);

    await waitFor(() => expect(screen.getByPlaceholderText(/Task title/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Task title/i), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText(/Add Task/i));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith('New Task', undefined);
      expect(fetchTasks).toHaveBeenCalledTimes(2); // Initial + after create
    });
  });

  it('handles task toggle', async () => {
    fetchTasks.mockResolvedValue(mockTasks);
    fetchStats.mockResolvedValue(mockStats);
    toggleTask.mockResolvedValueOnce({ ...mockTasks[0], status: 'done' });

    render(<App />);

    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(toggleTask).toHaveBeenCalledWith('1');
      expect(fetchTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('handles task deletion', async () => {
    fetchTasks.mockResolvedValue(mockTasks);
    fetchStats.mockResolvedValue(mockStats);
    deleteTask.mockResolvedValueOnce(undefined);

    render(<App />);

    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith('1');
      expect(fetchTasks).toHaveBeenCalledTimes(2);
    });
  });
});
