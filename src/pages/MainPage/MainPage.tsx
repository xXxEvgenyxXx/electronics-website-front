import { MainLayout } from "@/widgets"
import s from './MainPage.module.scss'
import { CategoryCard } from "@/widgets"
import { categories } from "@/shared"

export function MainPage(){
    return (
        <MainLayout>
            <div className={s.mainPageWrapper}>
                <h1>Популярные категории</h1>
                <div className={s.categoryCards}>
                    {categories.map((category) => (
                        <CategoryCard image={category.image} name={category.name}/>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}