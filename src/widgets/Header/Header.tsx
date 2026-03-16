import s from './Header.module.scss';
import { NavLink, type NavLinkRenderProps, Link } from 'react-router';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';

export function Header() {
    const getLinkClass = ({ isActive }: NavLinkRenderProps) => 
        isActive ? `${s.headerLink} ${s.active}` : s.headerLink;

    return (
        <header className={s.header}>
            <h2>
                <Link className={s.title} to="/">
                    ЭлектроГрад
                </Link>
            </h2>
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
        </header>
    );
}