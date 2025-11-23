import { Card, Checkbox, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { cn } from '../lib/utils';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-md animate-fade-in group',
        task.completed && 'opacity-60'
      )}
      bodyStyle={{ padding: '16px' }}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <label
            onClick={() => onToggle(task.id)}
            className={cn(
              'text-base font-medium cursor-pointer transition-all block',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p
              className={cn(
                'text-sm text-muted-foreground mt-1 transition-all',
                task.completed && 'line-through'
              )}
            >
              {task.description}
            </p>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 hover:text-red-500"
            danger
          />
        </div>
      </div>
    </Card>
  );
};
