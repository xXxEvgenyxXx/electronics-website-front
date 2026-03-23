// UserDataEdit.tsx
import { forwardRef, useImperativeHandle } from 'react';
import { Form, Input } from 'antd';
import s from './UserDataEdit.module.scss';

interface UserDataEditProps {
  data: {
    id: number;
    email: string;
    login: string;
    name: string;
    surname: string;
    patronymic?: string;
  };
}

// Define the ref handle type
export interface UserDataEditRef {
  getFormValues: () => {
    name: string;
    surname: string;
    patronymic?: string;
    login: string;
  };
}

export const UserDataEdit = forwardRef<UserDataEditRef, UserDataEditProps>(
  (props, ref) => {
    const [form] = Form.useForm();

    // Expose a method to get current form values
    useImperativeHandle(ref, () => ({
      getFormValues: () => form.getFieldsValue(),
    }));

    return (
      <div className={s.userDataEdit}>
        <Form
          form={form}
          initialValues={{
            name: props.data.name,
            surname: props.data.surname,
            patronymic: props.data.patronymic,
            login: props.data.login,
          }}
        >
          <Form.Item name="name" label="Ваше имя">
            <Input required />
          </Form.Item>
          <Form.Item name="surname" label="Ваша фамилия">
            <Input required />
          </Form.Item>
          <Form.Item name="patronymic" label="Ваше отчество (при наличии)">
            <Input />
          </Form.Item>
          <Form.Item name="login" label="Ваш логин">
            <Input required />
          </Form.Item>
        </Form>
      </div>
    );
  }
);