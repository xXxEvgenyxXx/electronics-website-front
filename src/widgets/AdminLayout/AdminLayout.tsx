import s from './AdminLayout.module.scss'
import { AdminNavbar } from './AdminNavbar'
import { MainLayout } from '../MainLayout'
import type { ReactNode } from 'react'

interface AdminLayoutProps {
    children: ReactNode
}

export function AdminLayout(props: AdminLayoutProps){
    return (
        <MainLayout>
            <div className={s.adminLayout}>
                <AdminNavbar/>
                <div className={s.content}>
                    {props.children}
                </div>
            </div>
        </MainLayout>
    )
}