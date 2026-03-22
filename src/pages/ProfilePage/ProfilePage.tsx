import s from './ProfilePage.module.scss'
import { ProfileLayout, UserData } from '@/widgets'

export function ProfilePage(){
    return (
        <ProfileLayout>
            <div className={s.profilePage}>
                <UserData/>
            </div>
        </ProfileLayout>
    )
}