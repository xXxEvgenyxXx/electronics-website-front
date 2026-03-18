import s from './Header.module.scss';
import { NavLink, type NavLinkRenderProps, Link } from 'react-router';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Logo } from '../Logo';
import { Switch } from 'antd';
import { useTheme } from '@/widgets';

export function Header() {
  const { theme, toggleTheme } = useTheme();

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
        <Link className={s.headerLink} to="/login">Вход</Link>
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