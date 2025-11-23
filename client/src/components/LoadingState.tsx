import { Spin } from 'antd';

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Spin size="large" />
    </div>
  );
};
