import React, { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ProtectedRoute/ProtectedRoute';
import { message } from 'antd';

interface ProtectedActionProps {
  children: ReactElement;
  onAction?: () => void;
  redirectTo?: string;
  showMessage?: boolean;
}

export const ProtectedAction: React.FC<ProtectedActionProps> = ({
  children,
  onAction,
  redirectTo = '/login',
  showMessage = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    // Если ещё идёт проверка авторизации – ничего не делаем (или можно заблокировать)
    if (isLoading) {
      event.preventDefault();
      return;
    }

    if (!isAuthenticated) {
      event.preventDefault();
      if (showMessage) {
        message.warning('Пожалуйста, войдите в аккаунт');
      }
      navigate(redirectTo);
      return;
    }

    // Авторизован – вызываем переданное действие
    if (onAction) {
      onAction();
    }
  };

  // Клонируем дочерний элемент и добавляем обработчик клика
  return React.cloneElement(children, {
    onClick: handleClick,
  });
};