import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData } from '../types/task';
import { taskApi } from '../lib/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.getAll();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (data: TaskFormData) => {
    try {
      setError(null);
      const newTask = await taskApi.create(data);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      setError(null);
      const updatedTask = await taskApi.update(id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      setError(null);
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updatedTask = await taskApi.toggleComplete(id, !task.completed);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to toggle task completion');
      console.error('Error toggling task:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refetch: fetchTasks,
  };
};
