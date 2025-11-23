import { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { TaskFormData } from '../types/task';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  defaultValues?: TaskFormData;
  submitLabel?: string;
}

export const TaskForm = ({
  onSubmit,
  onCancel,
  defaultValues,
  submitLabel = 'Add Task',
}: TaskFormProps) => {
  const [form] = Form.useForm<TaskFormData>();

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    } else {
      form.resetFields();
    }
  }, [defaultValues, form]);

  const handleSubmit = (values: TaskFormData) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="space-y-4"
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          { required: true, message: 'Title is required' },
          { max: 100, message: 'Title is too long' },
        ]}
      >
        <Input placeholder="Enter task title..." />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ max: 500, message: 'Description is too long' }]}
      >
        <Input.TextArea
          placeholder="Add more details (optional)..."
          rows={4}
          className="resize-none"
        />
      </Form.Item>
      <div className="flex gap-3 justify-end pt-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          {submitLabel}
        </Button>
      </div>
    </Form>
  );
};
