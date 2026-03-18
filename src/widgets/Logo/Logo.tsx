import s from './Logo.module.scss'
import { Link } from 'react-router'

export function Logo(){
    return (
        <h2>
            <Link className={s.logo} to="/">
                ЭлектроГрад
            </Link>
        </h2>
    )
}