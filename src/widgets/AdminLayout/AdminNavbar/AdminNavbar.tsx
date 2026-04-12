import s from './AdminNavbar.module.scss'
import { NavLink } from 'react-router'
import type { NavLinkRenderProps } from 'react-router';
import clsx from 'clsx'

export function AdminNavbar(){
    const getLinkClass = ({ isActive }: NavLinkRenderProps) =>
    isActive ? clsx(s.adminLink, s.active) : s.adminLink;
    return (
        <div className={s.adminNavbar}>
            <div className={s.content}>
                <NavLink className={getLinkClass} to="/admin-panel">Статистика</NavLink>
                <NavLink className={getLinkClass} to="/admin-products">Товары</NavLink>
                <NavLink className={getLinkClass} to="/admin-orders">Заказы</NavLink>
                <NavLink className={getLinkClass} to="/admin-categories">Категории</NavLink>
            </div>
        </div>
    )
}