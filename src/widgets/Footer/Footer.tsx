import s from './Footer.module.scss'
import { Logo } from '../Logo'
import { Link } from 'react-router'

export function Footer(){
    return (
        <footer className={s.footer}>
            <Logo />
            <div className={s.linksWrapper}>
                <h3>Поддержка</h3>
                <p>Малая Грузинская ул., 27/13, Москва, 123557</p>
                <p>electrograd@gmail.com</p>
                <p>+7 965 111 11-11</p>
            </div>
            <div className={s.linksWrapper}>
                <h3>Быстрые ссылки</h3>
                <p>
                    <Link className={s.link} to="/">Главная</Link>
                </p>
                <p>
                    <Link className={s.link} to="/catalog">Каталог</Link>
                </p>
                <p>
                    <Link className={s.link} to="/about">О нас</Link>
                </p>
                <p>
                    <Link className={s.link} to="/contacts">Контакты</Link>
                </p>
            </div>
        </footer>
    )
}