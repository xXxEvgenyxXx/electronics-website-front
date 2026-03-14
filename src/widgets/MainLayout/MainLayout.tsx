import type { ReactNode } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";

interface MainLayoutProps {
    children: ReactNode
}

export function MainLayout(props:MainLayoutProps){
    return (
        <>
            <Header />
            <main>
                {props.children}
            </main>
            <Footer />
        </>
    )
}