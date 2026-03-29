import { useState, useRef } from 'react';
import { Button, message } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { UserDataView } from './UserDataView/UserDataView';
import { UserDataEdit, type UserDataEditRef } from './UserDataEdit/UserDataEdit';
import s from './UserData.module.scss';

export function UserData() {
  const initialUser = JSON.parse(localStorage.getItem('user')!);
  const [userData, setUserData] = useState(initialUser);
  const [isEditable, setIsEditable] = useState(false);
  const editFormRef = useRef<UserDataEditRef>(null);

  const handleEditClick = () => setIsEditable(true);
  const handleCancel = () => setIsEditable(false);

  const handleSave = async () => {
    const updatedFormValues = editFormRef.current?.getFormValues();
    if (!updatedFormValues) return;

    // Создаем объект обновления, исключая вложенные объекты
    const updatePayload = { ...updatedFormValues };

    try {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      const savedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(savedUser));
      setUserData(savedUser);
      setIsEditable(false);
      message.success('Данные сохранены');
    } catch (error) {
      console.error('Save error:', error);
      message.error('Не удалось сохранить данные');
    }
  };

  return (
    <div className={s.userDataWrapper}>
      <UserOutlined className={s.avatar} />
      {!isEditable ? (
        <div className={s.userData}>
          <UserDataView data={userData} />
          <Button className={s.button} type="primary" onClick={handleEditClick} icon={<EditOutlined />}>
            Редактировать профиль
          </Button>
        </div>
      ) : (
        <div className={s.userData}>
          <UserDataEdit ref={editFormRef} data={userData} />
          <div className={s.buttonsWrapper}>
            <Button className={s.button} type="primary" onClick={handleSave} icon={<SaveOutlined />}>
              Сохранить
            </Button>
            <Button className={s.button} onClick={handleCancel} icon={<CloseOutlined />}>
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}