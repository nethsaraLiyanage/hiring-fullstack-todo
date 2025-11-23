import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskFormData } from '../types/task';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { TaskForm } from '../components/TaskForm';

const Index = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleComplete } =
    useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (data: TaskFormData) => {
    addTask(data);
    setIsAddModalOpen(false);
    message.success('Task added! Your new task has been created successfully.');
  };

  const handleEditTask = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setIsEditModalOpen(false);
      setEditingTask(null);
      message.success('Task updated! Your task has been updated successfully.');
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    message.error('Task deleted. The task has been removed.');
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            My Tasks
          </h1>
          <p className="text-muted-foreground">
            Organize your day, accomplish your goals
          </p>
        </header>

        {/* Add Task Button */}
        <div
          className="mb-6 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <Button
            type="primary"
            size="large"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-14 shadow-md hover:shadow-lg transition-all"
            icon={<PlusOutlined />}
          >
            Add New Task
          </Button>
        </div>

        {/* Task List */}
        <div
          className="space-y-3 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {loading ? (
            <LoadingState />
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {tasks
                .filter((t: Task) => !t.completed)
                .map((task: Task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleComplete}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                  />
                ))}

              {tasks.filter((t: Task) => t.completed).length > 0 && (
                <>
                  <div className="pt-6 pb-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Completed ({tasks.filter((t: Task) => t.completed).length}
                      )
                    </h2>
                  </div>
                  {tasks
                    .filter((t: Task) => t.completed)
                    .map((task: Task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleComplete}
                        onEdit={openEditModal}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Add Task Modal */}
        <Modal
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          title="Add New Task"
          footer={null}
          width={500}
        >
          <p className="text-muted-foreground mb-4">
            Create a new task to keep track of your todos.
          </p>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddModalOpen(false)}
            submitLabel="Add Task"
          />
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          title="Edit Task"
          footer={null}
          width={500}
        >
          <p className="text-muted-foreground mb-4">
            Update the details of your task.
          </p>
          {editingTask && (
            <TaskForm
              onSubmit={handleEditTask}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingTask(null);
              }}
              defaultValues={{
                title: editingTask.title,
                description: editingTask.description,
              }}
              submitLabel="Save Changes"
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Index;
