import s from './ProfileNav.module.scss'
import { NavLink } from 'react-router'
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import type { NavLinkRenderProps } from 'react-router'
import clsx from 'clsx'

export function ProfileNav(){

    const getLinkClass = ({isActive}:NavLinkRenderProps) =>
        isActive ? clsx(s.active, s.profileNavLink) : s.profileNavLink
    return (
        <div className={s.profileNav}>
            <div className={s.profileNavContent}>
                <NavLink to="/profile" className={getLinkClass}><UserOutlined/> Личный кабинет</NavLink>
                <NavLink to="/my-orders" className={getLinkClass}><ShoppingCartOutlined/> Мои заказы</NavLink>
            </div>
        </div>
    )
}