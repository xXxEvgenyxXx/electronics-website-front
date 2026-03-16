import s from './Header.module.scss'
import { Link } from 'react-router'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'

export function Header(){
    return (
        <header className={s.header}>
            <h2><Link to="/"><img src="/logo.svg"/></Link></h2>
            <div className={s.headerLinks}>
                <Link className={s.headerLink} to="/">Главная</Link>
                <Link className={s.headerLink} to="/catalog">Каталог</Link>
                <Link className={s.headerLink} to="/about">О нас</Link>
                <Link className={s.headerLink} to="/contacts">Контакты</Link>
            </div>
            <div className={s.headerLinks}>
                <Link className={s.headerLink} to="/favorite">
                    <HeartOutlined /> Избранное
                </Link>
                <Link className={s.headerLink} to="/cart">
                    <ShoppingCartOutlined /> Корзина
                </Link>
                <Link className={s.headerLink} to="/login">Войти</Link>
                <Link className={s.headerLink} to="/register">Зарегистрироваться</Link>
            </div>
        </header>
    )
}