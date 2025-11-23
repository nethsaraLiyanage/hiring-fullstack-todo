import axios from 'axios';
import { Task, TaskFormData } from '../types/task';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.NX_API_URL ||
  'http://localhost:3338/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/todos');
    return response.data.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }));
  },

  // Create a new task
  create: async (data: TaskFormData): Promise<Task> => {
    const response = await api.post<Task>('/todos', data);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Update a task
  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/todos/${id}`, data);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Delete a task
  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Toggle task completion
  toggleComplete: async (id: string, completed: boolean): Promise<Task> => {
    const response = await api.put<Task>(`/todos/${id}`, { completed });
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },
};
