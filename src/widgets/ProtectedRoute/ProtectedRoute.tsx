import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import s from './ProtectedRoute.module.scss';

interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  role: {
    id: number;
    name: string;
  };
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция проверки токена
    const userData = localStorage.getItem('user');
    setTimeout(() => {
      if (userData) {
        try {
          const parsed: User = JSON.parse(userData);
          setIsAuthenticated(true);
          // Извлекаем имя роли (например, 'admin')
          setUserRole(parsed.role?.name || null);
        } catch {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  return { isAuthenticated, userRole, isLoading };
};

// Компонент для обычного защищённого маршрута (только авторизация)
interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className={s.loading}>
        <LoadingOutlined />
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// Компонент для админского маршрута (авторизация + роль admin)
interface AdminRouteProps {
  children: ReactNode;
  redirectTo?: string; // куда редиректить, если не админ (по умолчанию "/")
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children, redirectTo = '/' }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className={s.loading}>
        <LoadingOutlined />
      </div>
    );
  }

  // Если не авторизован – на страницу логина
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если авторизован, но роль не admin – редирект
  if (userRole !== 'admin') {
    return <Navigate to={redirectTo} replace />;
  }

  // Если админ – показываем children
  return children;
};