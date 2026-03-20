import s from './ProfilePage.module.scss'
import { MainLayout } from '@/widgets'

export function ProfilePage(){
    return (
        <MainLayout>
            <div className={s.profilePage}>
                Личный Кабинет
            </div>
        </MainLayout>
    )
}