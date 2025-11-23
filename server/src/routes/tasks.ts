import express, { Request, Response } from 'express';
import { Task } from '../models/Task';

const router = express.Router();

const transformTask = (task: any) => {
  const taskObj = task.toObject ? task.toObject() : task;
  return {
    id: taskObj._id.toString(),
    title: taskObj.title,
    description: taskObj.description,
    completed: taskObj.completed,
    createdAt: taskObj.createdAt,
  };
};

// GET /api/todos - Get all todos
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.json(tasks.map(transformTask));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      error: 'Failed to fetch tasks',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (title.length > 100) {
      return res.status(400).json({ error: 'Title is too long' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description is too long' });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      createdAt: new Date(),
    });

    const savedTask = await task.save();
    return res.status(201).json(transformTask(savedTask));
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      error: 'Failed to create task',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (title && title.length > 100) {
      return res.status(400).json({ error: 'Title is too long' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description is too long' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (completed !== undefined) updateData.completed = completed;

    const task = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json(transformTask(task));
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({
      error: 'Failed to update task',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      error: 'Failed to delete task',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
