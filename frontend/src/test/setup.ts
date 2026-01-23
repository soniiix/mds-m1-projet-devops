import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock des API
vi.mock('../api/tasks.api', () => ({
  fetchTasks: vi.fn().mockResolvedValue([]),
  createTask: vi.fn(),
  toggleTask: vi.fn(),
  deleteTask: vi.fn(),
  fetchStats: vi.fn().mockResolvedValue({
    total: 0,
    todo: 0,
    done: 0,
    completionRate: 0,
  }),
}));
