import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { NavLink, type NavLinkRenderProps, Link } from 'react-router';
import { HeartOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Logo } from '../Logo';
import { Switch, Button } from 'antd';
import { useTheme } from '@/widgets';
import s from './Header.module.scss';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ login: string } | null>(null);

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Ошибка парсинга данных пользователя', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // перенаправляем на главную после выхода
  };

  const getLinkClass = ({ isActive }: NavLinkRenderProps) =>
    isActive ? `${s.headerLink} ${s.active}` : s.headerLink;

  return (
    <header className={s.header}>
      <Logo />
      <div className={s.headerLinks}>
        <NavLink className={getLinkClass} to="/" end>Главная</NavLink>
        <NavLink className={getLinkClass} to="/catalog">Каталог</NavLink>
        <NavLink className={getLinkClass} to="/about">О нас</NavLink>
        <NavLink className={getLinkClass} to="/contacts">Контакты</NavLink>
      </div>
      <div className={s.headerLinks}>
        <NavLink className={getLinkClass} to="/favorite">
          <HeartOutlined />
        </NavLink>
        <NavLink className={getLinkClass} to="/cart">
          <ShoppingCartOutlined />
        </NavLink>
        {user ? (
          <>
            <NavLink className={s.headerLink} to="/profile">{user.login}</NavLink>
            <Button
              type="link"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
              className={s.headerLink}
            />
          </>
        ) : (
          <Link className={s.headerLink} to="/login">Вход</Link>
        )}
      </div>
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
      />
    </header>
  );
}