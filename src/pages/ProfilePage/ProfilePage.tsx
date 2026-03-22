import s from './ProfilePage.module.scss'
import { ProfileLayout } from '@/widgets'

export function ProfilePage(){
    console.log(localStorage.getItem('user'))
    return (
        <ProfileLayout>
            <div className={s.profilePage}>
                Profile page
            </div>
        </ProfileLayout>
    )
}