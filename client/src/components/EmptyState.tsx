import { Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Empty
        image={<FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
        description={
          <span className="text-muted-foreground">
            No tasks yet. Create your first task to get started!
          </span>
        }
      />
    </div>
  );
};
