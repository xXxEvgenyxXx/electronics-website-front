import s from './Header.module.scss'
import { Link } from 'react-router'
import { routes } from '@/app/routes'

export function Header(){
    return (
        <header className={s.header}>
            {routes.map((route) => (
                <p>
                    <Link to={route.path}>{route.name}</Link>
                </p>
            ))}
        </header>
    )
}