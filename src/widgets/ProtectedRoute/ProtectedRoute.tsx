import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import s from './ProtectedRoute.module.scss'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция проверки токена
    const token = localStorage.getItem('user');
    setTimeout(() => {
      setIsAuthenticated(!!token);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { isAuthenticated, isLoading };
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // допустим, возвращает состояние авторизации
  const location = useLocation();

  if (isLoading) {
    return <div className={s.loading}>
        <LoadingOutlined />
    </div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};