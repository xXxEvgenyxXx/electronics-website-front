import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { NavLink, type NavLinkRenderProps, Link } from 'react-router';
import { HeartOutlined, ShoppingCartOutlined, LogoutOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { Logo } from '../Logo';
import { Switch, Button, Drawer } from 'antd';
import { useTheme } from '@/widgets';
import s from './Header.module.scss';
import clsx from 'clsx';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ login: string; role?: { name: string } } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const getLinkClass = ({ isActive }: NavLinkRenderProps) =>
    isActive ? clsx(s.headerLink, s.active) : s.headerLink;

  // Общие ссылки для десктопа и мобильного меню
  const navLinks = (
    <>
      <NavLink className={getLinkClass} to="/" end onClick={closeMenu}>Главная</NavLink>
      <NavLink className={getLinkClass} to="/catalog" onClick={closeMenu}>Каталог</NavLink>
      <NavLink className={getLinkClass} to="/contacts" onClick={closeMenu}>Контакты</NavLink>
    </>
  );

  const iconLinks = (
    <>
      <NavLink className={getLinkClass} to="/favorite" onClick={closeMenu}>
        <HeartOutlined />
      </NavLink>
      <NavLink className={getLinkClass} to="/cart" onClick={closeMenu}>
        <ShoppingCartOutlined />
      </NavLink>
      {user?.role?.name === "admin" && (
        <NavLink className={getLinkClass} to="/admin-panel" onClick={closeMenu}>
          <SettingOutlined />
        </NavLink>
      )}
    </>
  );

  const userSection = user ? (
    <>
      <Link className={s.headerLink} to="/profile" onClick={closeMenu}>{user.login}</Link>
      <Button
        type="link"
        onClick={handleLogout}
        icon={<LogoutOutlined />}
        className={s.headerLink}
      />
    </>
  ) : (
    <Link className={s.headerLink} to="/login" onClick={closeMenu}>Вход</Link>
  );

  return (
    <header className={s.header}>
      <Logo />
      {!isMobile && (
        <>
          <div className={s.headerLinks}>{navLinks}</div>
          <div className={s.headerLinks}>
            {iconLinks}
            {userSection}
          </div>
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </>
      )}

      {isMobile && (
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '24px', color: 'var(--color-text)' }} />}
            onClick={() => setMobileMenuOpen(true)}
            className={s.burgerButton}
          />
          <Drawer
            title="Меню"
            placement="right"
            onClose={closeMenu}
            open={mobileMenuOpen}
            className={s.mobileDrawer}
            width="80%"
          >
            <div className={s.mobileMenuContent}>
              <div className={s.mobileMenuSection}>{navLinks}</div>
              <div className={s.mobileMenuSection}>{iconLinks}</div>
              <div className={s.mobileMenuSection}>{userSection}</div>
              <div className={s.mobileMenuSection}>
                <span className={s.themeLabel}>Тема:</span>
                <Switch
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  checkedChildren="🌙"
                  unCheckedChildren="☀️"
                />
              </div>
            </div>
          </Drawer>
        </>
      )}
    </header>
  );
}