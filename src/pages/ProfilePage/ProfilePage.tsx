import s from './ProfilePage.module.scss'
import { ProfileLayout } from '@/widgets'

export function ProfilePage(){
    console.log(localStorage.getItem('user'))
    return (
        <ProfileLayout>
            1234
        </ProfileLayout>
    )
}