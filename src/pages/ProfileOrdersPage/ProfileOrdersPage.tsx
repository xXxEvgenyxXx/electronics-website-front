import s from './ProfileOrdersPage.module.scss'
import { ProfileLayout } from '@/widgets'

export function ProfileOrdersPage(){
    return (
        <ProfileLayout>
            <div className={s.profileOrders}>
                Profile orders page
            </div>
        </ProfileLayout>
    )
}