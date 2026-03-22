import { ProfileNav } from "../ProfileNav/ProfileNav";
import { MainLayout } from "../MainLayout";
import s from './ProfileLayout.module.scss'
import type { ReactNode } from "react";

interface ProfileLayoutProps {
    children: ReactNode
}

export function ProfileLayout(props: ProfileLayoutProps){
    return (
        <MainLayout>
            <div className={s.profilePage}>
                <ProfileNav />
                <div className={s.profileContent}>
                    {props.children}
                </div>
            </div>
        </MainLayout>
    )
}