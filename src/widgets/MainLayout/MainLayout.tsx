import type { ReactNode } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import s from './MainLayout.module.scss'

interface MainLayoutProps {
    children: ReactNode
}

export function MainLayout(props:MainLayoutProps){
    return (
        <div className={s.mainLayout}>
            <Header />
            <main className={s.main}>
                {props.children}
            </main>
            <Footer />
        </div>
    )
}